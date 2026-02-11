/**
 * Mint Page - Premium NFT Minting Experience
 * Split-screen layout with stats bar, preview panel, console, and progress tracker
 * Also shows user's owned game items inventory
 */

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { MintStatsBar } from "./components/MintStatsBar";
import { NFTPreviewPanel } from "./components/NFTPreviewPanel";
import { MintingConsole } from "./components/MintingConsole";
import { NftCard } from "../../components/NftCard";
import { useUserGameItemsInventory } from "../../hooks/useUserGameItemsInventory";
import {
  useMintGacha,
  useMintPriceMzcal,
  useMZCALBalance,
  useIsApprovedForAll,
  useApproveGameItems,
} from "../../hooks/useMintGacha";

// Mock data - replace with real contract data
const MOCK_DATA = {
  totalSupply: 1000,
  mintedCount: 247,
  holdersCount: 89,
  pricePerMint: 500,
};

export function Mint() {
  const { address } = useAccount();
  const [tokenIds, setTokenIds] = useState<number[]>([]);
  const [loadingTokenIds, setLoadingTokenIds] = useState(true);
  const [activeError, setActiveError] = useState<string | null>(null);
  const [activeSuccess, setActiveSuccess] = useState<string | null>(null);

  // Mint price and balance
  const { mintPrice } = useMintPriceMzcal();
  const { balance: mzcalBalance, refetch: refetchBalance } =
    useMZCALBalance(address);
  const { isApproved, refetch: refetchApproval } = useIsApprovedForAll(address);

  // Minting hooks
  const {
    approve,
    isPending: isApproving,
    isConfirming: isApprovingConfirming,
    isSuccess: isApprovedTx,
    error: approveError,
  } = useApproveGameItems();
  const {
    mintGacha,
    isPending: isMinting,
    isConfirming: isMintingConfirming,
    isSuccess: isMintSuccess,
    error: mintError,
  } = useMintGacha();

  // Load token IDs from public JSON file
  useEffect(() => {
    const loadTokenIds = async () => {
      try {
        const response = await fetch("/tokenIds_all.json");
        if (!response.ok) throw new Error("Failed to load token IDs");
        const data = await response.json();
        setTokenIds(data.tokenIds || []);
      } catch (error) {
        console.error("Error loading token IDs:", error);
        setTokenIds([]);
      } finally {
        setLoadingTokenIds(false);
      }
    };

    loadTokenIds();
  }, []);

  // Fetch user's game items inventory
  const {
    items: userItems,
    loading: loadingInventory,
    error: inventoryError,
    refresh: refreshInventory,
  } = useUserGameItemsInventory({
    tokenIds,
    pageSize: 200,
    concurrencyLimit: 8,
  });

  // Handle errors from hooks
  useEffect(() => {
    if (approveError) {
      // Extract a cleaner error message if possible
      const msg = (approveError as any).shortMessage || approveError.message || "Approval failed";
      setActiveError(msg);
    }
  }, [approveError]);

  useEffect(() => {
    if (mintError) {
      const msg = (mintError as any).shortMessage || mintError.message || "Minting failed";
      setActiveError(msg);
    }
  }, [mintError]);

  // Handle successful approval
  useEffect(() => {
    if (isApprovedTx) {
      refetchApproval();
      setActiveError(null);
      setActiveSuccess("MZCAL tokens approved successfully! You can now summon your warrior.");
    }
  }, [isApprovedTx, refetchApproval]);

  // Handle successful mint
  useEffect(() => {
    if (isMintSuccess) {
      refetchBalance();
      refreshInventory();
      setActiveError(null);
      setActiveSuccess("Warrior summoned successfully! Check your inventory below.");
    }
  }, [isMintSuccess, refetchBalance, refreshInventory]);

  const handleMint = (quantity: number) => {
    if (!address) {
      alert("Please connect your wallet");
      return;
    }

    // Check if approved
    if (!isApproved) {
      alert(
        "Please approve the GameItems contract to spend your MZCAL tokens first",
      );
      return;
    }

    setActiveError(null);
    setActiveSuccess(null);
    // Call mintGacha from contract
    mintGacha(quantity);
  };

  const handleApprove = () => {
    setActiveError(null);
    setActiveSuccess(null);
    approve();
  };

  return (
    <div className="min-h-full w-full flex flex-col items-center px-4 md:px-8 py-6">
      {/* Centered Container with max-width */}
      <div
        className="w-full flex flex-col gap-6"
        style={{ maxWidth: "1100px" }}
      >
        {/* Stats Bar */}
        <MintStatsBar
          totalSupply={MOCK_DATA.totalSupply}
          mintedCount={MOCK_DATA.mintedCount}
          holdersCount={MOCK_DATA.holdersCount}
        />

        {/* Main Content - Split Screen */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - NFT Preview */}
          <NFTPreviewPanel seasonName="Season 1" />

          {/* Right Panel - Minting Console */}
          <MintingConsole
            pricePerMint={mintPrice ? Number(formatUnits(mintPrice, 0)) : 500}
            tokenSymbol="$MZCAL"
            onMint={handleMint}
            onApprove={handleApprove}
            isMinting={isMinting || isMintingConfirming}
            isApproving={isApproving || isApprovingConfirming}
            isApproved={isApproved}
            userBalance={
              mzcalBalance ? Number(formatUnits(mzcalBalance, 0)) : 0
            }
            maxQuantity={10}
            isConnected={!!address}
            errorMessage={activeError || undefined}
            onClearError={() => setActiveError(null)}
            successMessage={activeSuccess || undefined}
            onClearSuccess={() => setActiveSuccess(null)}
          />
        </div>

        {/* Inventory Section */}
        <div
          className="rounded-3xl p-6 w-full"
          style={{
            background: "linear-gradient(180deg, #0C0C0C 0%, #181818 100%)",
            border: "3px solid rgba(249, 176, 100, 0.3)",
          }}
        >
          <h2
            className="mb-4 font-bold"
            style={{
              color: "#F9B064",
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "24px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Your Summoned Warriors
          </h2>

          {/* Loading state */}
          {(loadingTokenIds || loadingInventory) && (
            <div className="text-center py-8 text-gray-400">
              <p>Loading your inventory...</p>
            </div>
          )}

          {/* Error state */}
          {inventoryError && (
            <div
              className="p-4 rounded-lg mb-4 text-red-400"
              style={{
                background: "rgba(255, 0, 0, 0.1)",
                border: "1px solid rgba(255, 0, 0, 0.3)",
              }}
            >
              Error loading inventory: {inventoryError}
            </div>
          )}

          {/* Empty state */}
          {!loadingTokenIds && !loadingInventory && userItems.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>
                No warriors summoned yet. Start minting to build your
                collection!
              </p>
            </div>
          )}

          {/* Inventory Grid */}
          {!loadingTokenIds && !loadingInventory && userItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userItems.map((item) => (
                <NftCard key={`${item.tokenId}`} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Mint;
