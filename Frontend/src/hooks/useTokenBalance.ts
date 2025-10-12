import { useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { MZCAL_TOKEN_ADDRESS } from '../config/contracts'
import { MZCAL_TOKEN_ABI } from '../config/abi'

/**
 * Hook to read PRESALE_TOKEN balance for a given address
 * @param address - User's wallet address
 * @returns Balance of PRESALE_TOKEN
 */
export function usePresaleTokenBalance(address: `0x${string}` | undefined) {
  const PRESALE_TOKEN_ID = 2n // PRESALE_TOKEN ID from contract

  const { data: balance, isLoading } = useReadContract({
    address: MZCAL_TOKEN_ADDRESS,
    abi: MZCAL_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address, PRESALE_TOKEN_ID] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Format balance from wei to readable format
  const formattedBalance = balance ? formatUnits(balance as bigint, 0) : '0'

  return {
    balance: balance as bigint | undefined,
    formattedBalance,
    isLoading,
  }
}

/**
 * Hook to read MZCAL token balance for a given address
 * @param address - User's wallet address
 * @returns Balance of MZCAL tokens
 */
export function useMZCALTokenBalance(address: `0x${string}` | undefined) {
  const MZCAL_TOKEN_ID = 1n // MZCAL ID from contract

  const { data: balance, isLoading } = useReadContract({
    address: MZCAL_TOKEN_ADDRESS,
    abi: MZCAL_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address, MZCAL_TOKEN_ID] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Format balance from wei to readable format
  const formattedBalance = balance ? formatUnits(balance as bigint, 0) : '0'

  return {
    balance: balance as bigint | undefined,
    formattedBalance,
    isLoading,
  }
}
