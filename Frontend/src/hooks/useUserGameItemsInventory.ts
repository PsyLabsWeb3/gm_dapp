/**
 * Hook to fetch and cache user's ERC1155 GameItems inventory
 * Implements batching, concurrency control, and metadata caching
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { getContract } from 'viem'
import type { GameItem, MetadataItem } from '../lib/erc1155'
import { ERC1155_ABI, extractRarity, resolveErc1155Uri, resolveImageFromMetadata } from '../lib/erc1155'
import { GAME_ITEMS_ADDRESS } from '../config/contracts'

interface UseUserGameItemsInventoryOptions {
  tokenIds: (number | bigint)[]
  pageSize?: number
  concurrencyLimit?: number
}

interface UseUserGameItemsInventoryReturn {
  items: GameItem[]
  loading: boolean
  error: string | null
  refresh: () => void
}

/**
 * Chunk an array into smaller batches
 */
function chunkArray<T>(arr: T[], pageSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += pageSize) {
    chunks.push(arr.slice(i, i + pageSize))
  }
  return chunks
}

/**
 * Fetch metadata for a single token ID with timeout
 */
async function fetchMetadata(
  metadataUrl: string,
  timeoutMs: number = 5000
): Promise<MetadataItem | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    const response = await fetch(metadataUrl, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      console.warn(`Failed to fetch metadata: ${metadataUrl} (${response.status})`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.warn(`Error fetching metadata from ${metadataUrl}:`, error)
    return null
  }
}

/**
 * Queue metadata fetches with concurrency limit
 */
async function fetchWithConcurrencyLimit(
  items: Array<{ tokenId: number | bigint; metadataUrl: string }>,
  limit: number = 8
): Promise<Map<string, MetadataItem>> {
  const results = new Map<string, MetadataItem>()
  const queue = [...items]
  let active = 0

  return new Promise((resolve) => {
    const processNext = () => {
      while (active < limit && queue.length > 0) {
        active++
        const item = queue.shift()!

        fetchMetadata(item.metadataUrl)
          .then((metadata) => {
            if (metadata) {
              results.set(String(item.tokenId), metadata)
            }
          })
          .finally(() => {
            active--
            if (queue.length === 0 && active === 0) {
              resolve(results)
            } else {
              processNext()
            }
          })
      }

      if (queue.length === 0 && active === 0) {
        resolve(results)
      }
    }

    processNext()
  })
}

/**
 * Hook to get user's ERC1155 game items inventory
 * Fetches owned token IDs using balanceOfBatch with chunking
 * Resolves metadata with concurrency control and caching
 *
 * TODO: Ensure GAME_ITEMS_ADDRESS in contracts.ts matches your GameItems contract
 * TODO: If contract URI template differs from "{id}", update resolveErc1155Uri accordingly
 */
export function useUserGameItemsInventory({
  tokenIds,
  pageSize = 200,
  concurrencyLimit = 8,
}: UseUserGameItemsInventoryOptions): UseUserGameItemsInventoryReturn {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const [items, setItems] = useState<GameItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const metadataCache = useRef<Map<string, MetadataItem>>(new Map())
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  // Main effect: fetch all chunks and metadata
  useEffect(() => {
    if (!address || !publicClient || tokenIds.length === 0) {
      setItems([])
      setError(null)
      return
    }

    const loadInventory = async () => {
      try {
        setLoading(true)
        setError(null)

        // Convert token IDs to BigInt for contract calls
        const tokenIdsBigInt = tokenIds.map((id) => (typeof id === 'bigint' ? id : BigInt(id)))

        // Create contract instance
        const contract = getContract({
          address: GAME_ITEMS_ADDRESS,
          abi: ERC1155_ABI,
          client: publicClient,
        })

        // Chunk token IDs and fetch balances
        const chunks = chunkArray(tokenIdsBigInt, pageSize)
        const balanceMap = new Map<string, bigint>()

        for (const chunk of chunks) {
          try {
            const accounts = Array(chunk.length).fill(address)
            const balances = (await contract.read.balanceOfBatch([accounts, chunk])) as readonly bigint[]

            chunk.forEach((tokenId, index) => {
              const balance = balances[index]
              if (balance > 0n) {
                balanceMap.set(String(tokenId), balance)
              }
            })
          } catch (err) {
            console.error('Error fetching balances for chunk:', err)
          }
        }

        // Get owned token IDs
        const ownedIds = Array.from(balanceMap.keys()).map((id) => BigInt(id))

        if (ownedIds.length === 0) {
          setItems([])
          return
        }

        // Fetch URI for each owned token to resolve metadata URLs
        const metadataUrls: Array<{ tokenId: bigint; metadataUrl: string }> = []

        for (const tokenId of ownedIds) {
          const cached = metadataCache.current.get(String(tokenId))
          if (!cached) {
            try {
              const uriTemplate = (await contract.read.uri([tokenId])) as string
              const metadataUrl = resolveErc1155Uri(uriTemplate, tokenId)
              metadataUrls.push({ tokenId, metadataUrl })
            } catch (err) {
              console.warn(`Failed to fetch URI for token ${tokenId}:`, err)
            }
          }
        }

        // Fetch metadata with concurrency control
        if (metadataUrls.length > 0) {
          const fetchedMetadata = await fetchWithConcurrencyLimit(metadataUrls, concurrencyLimit)
          fetchedMetadata.forEach((metadata, tokenId) => {
            metadataCache.current.set(tokenId, metadata)
          })
        }

        // Build final items array
        const finalItems: GameItem[] = ownedIds.map((tokenId) => {
          const balance = balanceMap.get(String(tokenId)) || 0n
          const metadata = metadataCache.current.get(String(tokenId))
          const metadataUrl = metadataUrls.find((m) => String(m.tokenId) === String(tokenId))?.metadataUrl
          return {
            tokenId: Number(tokenId),
            balance,
            name: metadata?.name,
            image: metadata?.image && metadataUrl ? resolveImageFromMetadata(metadata.image, metadataUrl) : undefined,
            attributes: metadata?.attributes,
            rarity: metadata ? extractRarity(metadata) : undefined,
            metadataUrl,
          }
        })

        setItems(finalItems)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        console.error('Error loading inventory:', err)
      } finally {
        setLoading(false)
      }
    }

    loadInventory()
  }, [address, publicClient, tokenIds, pageSize, concurrencyLimit, refreshKey])

  return {
    items,
    loading,
    error,
    refresh,
  }
}
