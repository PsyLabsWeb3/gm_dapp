/**
 * Hook to mint gacha NFTs from GameItems contract
 * Includes read hooks for mint price and write hook for minting
 */

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import { GAME_ITEMS_ADDRESS, MZCAL_TOKEN_ADDRESS } from "../config/contracts";
import GameItemsABI from "../config/GameItems_ABI.json";
import { MZCAL_TOKEN_ABI } from "../config/abi";

/**
 * Hook to read the mint price in MZCAL tokens
 * @returns Mint price per gacha in MZCAL token units
 */
export function useMintPriceMzcal() {
  const {
    data: mintPrice,
    isLoading,
    refetch,
  } = useReadContract({
    address: GAME_ITEMS_ADDRESS,
    abi: GameItemsABI,
    functionName: "mintPriceMzcal",
  });

  return {
    mintPrice: mintPrice as bigint | undefined,
    isLoading,
    refetch,
  };
}

/**
 * Hook to read user's MZCAL token balance (for gacha minting)
 * @param address - User's wallet address
 * @returns Balance of MZCAL tokens
 */
export function useMZCALBalance(address: `0x${string}` | undefined) {
  const MZCAL_ID = 1n;

  const {
    data: balance,
    isLoading,
    refetch,
  } = useReadContract({
    address: MZCAL_TOKEN_ADDRESS,
    abi: MZCAL_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address, MZCAL_ID] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    balance: balance as bigint | undefined,
    isLoading,
    refetch,
  };
}

/**
 * Hook to check if user has approved GameItems contract to spend MZCAL tokens
 * @param address - User's wallet address
 * @returns Whether GameItems contract is approved as operator
 */
export function useIsApprovedForAll(address: `0x${string}` | undefined) {
  const {
    data: isApproved,
    isLoading,
    refetch,
  } = useReadContract({
    address: MZCAL_TOKEN_ADDRESS,
    abi: MZCAL_TOKEN_ABI,
    functionName: "isApprovedForAll",
    args: address ? [address, GAME_ITEMS_ADDRESS] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    isApproved: isApproved as boolean | undefined,
    isLoading,
    refetch,
  };
}

/**
 * Hook to approve GameItems contract to spend MZCAL tokens
 * @returns Object with write function and transaction state
 */
export function useApproveGameItems() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = () => {
    writeContract({
      address: MZCAL_TOKEN_ADDRESS,
      abi: MZCAL_TOKEN_ABI,
      functionName: "setApprovalForAll",
      args: [GAME_ITEMS_ADDRESS, true],
    });
  };

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to mint gacha NFTs
 * @returns Object with write function and transaction state
 */
export function useMintGacha() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mintGacha = (quantity: number) => {
    writeContract({
      address: GAME_ITEMS_ADDRESS,
      abi: GameItemsABI,
      functionName: "mintGacha",
      args: [BigInt(quantity)],
    });
  };

  return {
    mintGacha,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
