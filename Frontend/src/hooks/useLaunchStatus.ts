import { useReadContract } from 'wagmi'
import { MZCAL_TOKEN_ADDRESS } from '../config/contracts'
import { MZCAL_TOKEN_ABI } from '../config/abi'

/**
 * Hook to check if MZCAL token has been launched
 * @returns Object with launch status data and query state
 */
export function useLaunchStatus() {
  return useReadContract({
    address: MZCAL_TOKEN_ADDRESS,
    abi: MZCAL_TOKEN_ABI,
    functionName: 'mzcalTokenLaunched',
  })
}
