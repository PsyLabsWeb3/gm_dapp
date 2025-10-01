import { useReadContract } from 'wagmi'
import { MZCAL_TOKEN_ADDRESS } from '../config/contracts'
import { MZCAL_TOKEN_ABI } from '../config/abi'

/**
 * Hook to check if an address is whitelisted for presale
 * @param address - The Ethereum address to check
 * @returns Object with whitelist status data and query state
 */
export function useWhitelistStatus(address?: `0x${string}`) {
  return useReadContract({
    address: MZCAL_TOKEN_ADDRESS,
    abi: MZCAL_TOKEN_ABI,
    functionName: 'isWhitelisted',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address, // Only run query if address is provided
    }
  })
}
