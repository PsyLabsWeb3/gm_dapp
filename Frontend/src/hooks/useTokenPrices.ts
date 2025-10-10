import { useReadContract } from 'wagmi'
import { MZCAL_TOKEN_ADDRESS } from '../config/contracts'
import { MZCAL_TOKEN_ABI } from '../config/abi'
import { formatEther } from 'viem'

/**
 * Hook to get the presale token price
 * @returns Object with price data in wei and formatted in ETH
 */
export function usePresaleTokenPrice() {
  const result = useReadContract({
    address: MZCAL_TOKEN_ADDRESS,
    abi: MZCAL_TOKEN_ABI,
    functionName: 'presaleTokenPrice',
  })

  return {
    ...result,
    priceInWei: result.data as bigint | undefined,
    priceInEth: result.data ? formatEther(result.data as bigint) : '0',
  }
}

/**
 * Hook to get the MZCAL token price (after launch)
 * @returns Object with price data in wei and formatted in ETH
 */
export function useMzcalTokenPrice() {
  const result = useReadContract({
    address: MZCAL_TOKEN_ADDRESS,
    abi: MZCAL_TOKEN_ABI,
    functionName: 'mzcalTokenPrice',
  })

  return {
    ...result,
    priceInWei: result.data as bigint | undefined,
    priceInEth: result.data ? formatEther(result.data as bigint) : '0',
  }
}

/**
 * Hook to check if MZCAL token has been launched
 * @returns Object with launch status
 */
export function useMzcalTokenLaunched() {
  return useReadContract({
    address: MZCAL_TOKEN_ADDRESS,
    abi: MZCAL_TOKEN_ABI,
    functionName: 'mzcalTokenLaunched',
  })
}
