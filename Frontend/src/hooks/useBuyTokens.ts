import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MZCAL_TOKEN_ADDRESS } from "../config/contracts";
import { MZCAL_TOKEN_ABI } from "../config/abi";

/**
 * Hook to buy presale tokens
 * @returns Object with write function and transaction state
 */
export function useBuyPresale() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const buyPresale = (amount: bigint, totalCost: bigint) => {
    writeContract({
      address: MZCAL_TOKEN_ADDRESS,
      abi: MZCAL_TOKEN_ABI,
      functionName: "buyMZCAL",
      args: [amount],
      value: totalCost,
    });
  };

  return {
    buyPresale,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to buy MZCAL tokens (after launch)
 * @returns Object with write function and transaction state
 */
export function useBuyMZCAL() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const buyMZCAL = (amount: bigint, totalCost: bigint) => {
    writeContract({
      address: MZCAL_TOKEN_ADDRESS,
      abi: MZCAL_TOKEN_ABI,
      functionName: "buyMZCAL",
      args: [amount],
      value: totalCost,
    });
  };

  return {
    buyMZCAL,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to claim MZCAL tokens by burning PRESALE_TOKEN
 * @returns Object with write function and transaction state
 */
export function useClaimMZCAL() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const claimMZCAL = () => {
    writeContract({
      address: MZCAL_TOKEN_ADDRESS,
      abi: MZCAL_TOKEN_ABI,
      functionName: "claimMZCALTokens",
    });
  };

  return {
    claimMZCAL,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
