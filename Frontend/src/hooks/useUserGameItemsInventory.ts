/**
 * Hook to fetch and cache user's ERC1155 GameItems inventory
 * Implements batching, concurrency control, and metadata caching
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { getContract } from "viem";
import type { GameItem, MetadataItem } from "../lib/erc1155";
import {
  ERC1155_ABI,
  extractRarity,
  resolveErc1155Uri,
  resolveImageFromMetadata,
} from "../lib/erc1155";
import { GAME_ITEMS_ADDRESS } from "../config/contracts";

interface UseUserGameItemsInventoryOptions {
  tokenIds: (number | bigint)[];
  pageSize?: number;
  concurrencyLimit?: number;
}

interface UseUserGameItemsInventoryReturn {
  items: GameItem[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Chunk an array into smaller batches
 */
function chunkArray<T>(arr: T[], pageSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += pageSize) {
    chunks.push(arr.slice(i, i + pageSize));
  }
  return chunks;
}

/**
 * Alternative IPFS gateways - sorted by speed/reliability
 */
const IPFS_GATEWAYS = [
  "https://nftstorage.link/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://ipfs.io/ipfs/",
  "https://dweb.link/ipfs/",
  // remove pinata gateway for browser usage
];

// --- Improved fetchMetadata (browser-friendly, simple, robust) ---
async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJsonWithTimeout(url: string, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchMetadata(
  metadataUrl: string,
  timeoutMs = 15000,
): Promise<MetadataItem | null> {
  const urlsToTry: string[] = [];

  if (metadataUrl.includes("/ipfs/")) {
    const ipfsPath = metadataUrl.split("/ipfs/")[1];
    for (const g of IPFS_GATEWAYS) urlsToTry.push(`${g}${ipfsPath}`);
  } else {
    urlsToTry.push(metadataUrl);
  }

  // 2 passes: try all gateways twice with small backoff
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < urlsToTry.length; i++) {
      const tryUrl = urlsToTry[i];
      try {
        const res = await fetchJsonWithTimeout(tryUrl, timeoutMs);

        if (res.status === 429) {
          // rate limited -> wait and retry next
          await sleep(800 + pass * 700);
          continue;
        }

        if (!res.ok) continue;

        return (await res.json()) as MetadataItem;
      } catch {
        // timeout / CORS / network errors -> try next
        await sleep(150 + pass * 150);
      }
    }
  }

  return null;
}

/**
 * Queue metadata fetches with concurrency limit
 */
async function fetchWithConcurrencyLimit(
  items: Array<{ tokenId: number | bigint; metadataUrl: string }>,
  limit: number = 8,
): Promise<Map<string, MetadataItem>> {
  console.log(
    `[ConcurrencyQueue] Starting with ${items.length} items, limit: ${limit}`,
  );
  const results = new Map<string, MetadataItem>();
  const queue = [...items];
  let active = 0;
  let completed = 0;

  return new Promise((resolve) => {
    const processNext = () => {
      while (active < limit && queue.length > 0) {
        active++;
        const item = queue.shift()!;
        console.log(
          `[ConcurrencyQueue] Processing token ${item.tokenId} (active: ${active}, remaining: ${queue.length})`,
        );

        fetchMetadata(item.metadataUrl)
          .then((metadata) => {
            if (metadata) {
              results.set(String(item.tokenId), metadata);
            }
          })
          .finally(() => {
            active--;
            completed++;
            console.log(
              `[ConcurrencyQueue] Completed ${completed}/${items.length} (active: ${active}, remaining: ${queue.length})`,
            );
            if (queue.length === 0 && active === 0) {
              console.log(
                `[ConcurrencyQueue] All done! Fetched ${results.size} metadata items`,
              );
              resolve(results);
            } else {
              processNext();
            }
          });
      }

      if (queue.length === 0 && active === 0) {
        console.log(
          `[ConcurrencyQueue] Queue empty, resolving with ${results.size} results`,
        );
        resolve(results);
      }
    };

    processNext();
  });
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
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [items, setItems] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const metadataCache = useRef<Map<string, MetadataItem>>(new Map());
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!items.length) return;

    const withImage = items.filter((i) => !!i.image);
    const missingImage = items.filter((i) => !i.image);

    console.log(`[Inventory UI] items=${items.length}`);
    console.log(
      `[Inventory UI] withImage=${withImage.length}, missingImage=${missingImage.length}`,
    );

    if (missingImage.length > 0) {
      console.warn(
        `[Inventory UI] Missing images for tokenIds:`,
        missingImage.map((i) => ({
          tokenId: i.tokenId,
          name: i.name,
          metadataUrl: i.metadataUrl,
          rawImage: (i as any)?.rawImage, // only if you add it (see below)
          resolvedImage: i.image,
        })),
      );
    }
  }, [items]);

  // Main effect: fetch all chunks and metadata
  useEffect(() => {
    if (!address || !publicClient || tokenIds.length === 0) {
      setItems([]);
      setError(null);
      return;
    }

    const loadInventory = async () => {
      console.log(`[Inventory] Starting load for address: ${address}`);
      console.log(
        `[Inventory] Token IDs to check: ${tokenIds.length}`,
        tokenIds.slice(0, 10),
      );
      try {
        setLoading(true);
        setError(null);

        // Convert token IDs to BigInt for contract calls
        const tokenIdsBigInt = tokenIds.map((id) =>
          typeof id === "bigint" ? id : BigInt(id),
        );
        console.log(
          `[Inventory] Converted to BigInt:`,
          tokenIdsBigInt.slice(0, 10),
        );

        // Create contract instance
        const contract = getContract({
          address: GAME_ITEMS_ADDRESS,
          abi: ERC1155_ABI,
          client: publicClient,
        });

        // Chunk token IDs and fetch balances
        const chunks = chunkArray(tokenIdsBigInt, pageSize);
        console.log(
          `[Inventory] Created ${chunks.length} chunks of size ${pageSize}`,
        );
        const balanceMap = new Map<string, bigint>();

        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          console.log(
            `[Inventory] Fetching balances for chunk ${i + 1}/${chunks.length} (${chunk.length} tokens)`,
          );
          try {
            const accounts = Array(chunk.length).fill(address);
            const balances = (await contract.read.balanceOfBatch([
              accounts,
              chunk,
            ])) as readonly bigint[];
            console.log(`[Inventory] Chunk ${i + 1} balances:`, balances);

            chunk.forEach((tokenId, index) => {
              const balance = balances[index];
              if (balance > 0n) {
                console.log(
                  `[Inventory] Found owned token: ${tokenId} with balance: ${balance}`,
                );
                balanceMap.set(String(tokenId), balance);
              }
            });
          } catch (err) {
            console.error(
              `[Inventory] Error fetching balances for chunk ${i + 1}:`,
              err,
            );
          }
        }

        // Get owned token IDs
        const ownedIds = Array.from(balanceMap.keys()).map((id) => BigInt(id));
        console.log(
          `[Inventory] Total owned tokens found: ${ownedIds.length}`,
          ownedIds,
        );

        if (ownedIds.length === 0) {
          console.log(`[Inventory] No owned tokens, setting empty items`);
          setItems([]);
          return;
        }

        // Fetch URI for each owned token to resolve metadata URLs
        const metadataUrls: Array<{ tokenId: bigint; metadataUrl: string }> =
          [];
        console.log(
          `[Inventory] Fetching URIs for ${ownedIds.length} owned tokens`,
        );

        for (const tokenId of ownedIds) {
          const cached = metadataCache.current.get(String(tokenId));
          if (cached) {
            console.log(
              `[Inventory] Using cached metadata for token ${tokenId}`,
            );
          } else {
            try {
              const uriTemplate = (await contract.read.uri([
                tokenId,
              ])) as string;
              console.log(
                `[Inventory] URI template for token ${tokenId}: ${uriTemplate}`,
              );
              const metadataUrl = resolveErc1155Uri(uriTemplate, tokenId);
              console.log(
                `[Inventory] Resolved metadata URL for token ${tokenId}: ${metadataUrl}`,
              );
              metadataUrls.push({ tokenId, metadataUrl });
            } catch (err) {
              console.error(
                `[Inventory] Failed to fetch URI for token ${tokenId}:`,
                err,
              );
            }
          }
        }
        console.log(
          `[Inventory] Total metadata URLs to fetch: ${metadataUrls.length}`,
        );

        // Fetch metadata with concurrency control
        if (metadataUrls.length > 0) {
          console.log(
            `[Inventory] Starting concurrent metadata fetch (limit: ${concurrencyLimit})`,
          );
          const fetchedMetadata = await fetchWithConcurrencyLimit(
            metadataUrls,
            concurrencyLimit,
          );
          console.log(
            `[Inventory] Fetched ${fetchedMetadata.size} metadata items successfully`,
          );
          fetchedMetadata.forEach((metadata, tokenId) => {
            console.log(`[Inventory] Caching metadata for token ${tokenId}`);
            metadataCache.current.set(tokenId, metadata);
          });
        }

        // Build final items array
        console.log(
          `[Inventory] Building final items array for ${ownedIds.length} tokens`,
        );
        const finalItems: GameItem[] = ownedIds.map((tokenId) => {
          const balance = balanceMap.get(String(tokenId)) || 0n;
          const metadata = metadataCache.current.get(String(tokenId));
          const metadataUrl = metadataUrls.find(
            (m) => String(m.tokenId) === String(tokenId),
          )?.metadataUrl;

          if (!metadata) {
            console.warn(
              `[Inventory] ⚠️ Token ${tokenId}: NO METADATA FOUND (not in cache)`,
            );
          }

          const image =
            metadata?.image && metadataUrl
              ? resolveImageFromMetadata(metadata.image, metadataUrl)
              : undefined;

          const rarity = metadata ? extractRarity(metadata) : undefined;

          console.log(
            `[Inventory] Token ${tokenId}: name=${metadata?.name || "MISSING"}, image=${image ? "RESOLVED" : "MISSING"}, rarity=${rarity || "MISSING"}`,
          );

          return {
            tokenId: Number(tokenId),
            balance,
            name: metadata?.name,
            image,
            attributes: metadata?.attributes,
            rarity,
            metadataUrl,
          };
        });

        console.log(`[Inventory] Setting ${finalItems.length} items in state`);
        setItems(finalItems);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error(`[Inventory] Fatal error loading inventory:`, err);
        setError(message);
      } finally {
        console.log(`[Inventory] Load complete, setting loading to false`);
        setLoading(false);
      }
    };

    loadInventory();
  }, [address, publicClient, tokenIds, pageSize, concurrencyLimit, refreshKey]);

  return {
    items,
    loading,
    error,
    refresh,
  };
}
