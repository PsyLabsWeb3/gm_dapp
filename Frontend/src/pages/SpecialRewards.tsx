/**
 * Special Rewards Page
 * Displays exclusive benefits for Mythic NFT holders
 * If the user owns a Mythic game item, shows the NFT + perks
 * Otherwise displays a "no mythic" message
 */

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { NftCard } from "../components/NftCard";
import { useUserGameItemsInventory } from "../hooks/useUserGameItemsInventory";
import type { GameItem } from "../lib/erc1155";

/* ------------------------------------------------------------------ */
/*  Reward definitions                                                 */
/* ------------------------------------------------------------------ */

interface Reward {
  icon: string;
  title: string;
  description: string;
}

const MYTHIC_REWARDS: Reward[] = [
  {
    icon: "🏡",
    title: "Solmare Jungle Accommodation",
    description:
      "Exclusive access to a private stay at our Solmare jungle retreat in Oaxaca — fully paid for Mythic holders.",
  },
  {
    icon: "🍶",
    title: "Special Mzcal Bottles",
    description:
      "Receive limited-edition, hand-crafted mezcal bottles shipped directly to your door every season.",
  },
  {
    icon: "🪞",
    title: "Digital Twins",
    description:
      "Your Mythic warrior unlocks a 1-of-1 digital twin — a living on-chain companion that evolves over time.",
  },
  {
    icon: "🎟️",
    title: "VIP Event Access",
    description:
      "Priority entry to all future IRL and virtual community events, tastings, and launches.",
  },
  {
    icon: "⚔️",
    title: "Governance Power",
    description:
      "Mythic holders receive amplified voting weight in all DAO proposals and treasury decisions.",
  },
  {
    icon: "🎁",
    title: "Exclusive Airdrops",
    description:
      "First in line for future season airdrops, partner collaborations, and surprise drops.",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function RewardCard({ reward }: { reward: Reward }) {
  return (
    <div
      className="rounded-2xl p-5 flex items-start gap-4 transition-transform hover:scale-[1.02]"
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        border: "2px solid rgba(249, 176, 100, 0.25)",
      }}
    >
      <span className="text-3xl mt-1 shrink-0">{reward.icon}</span>
      <div>
        <h3
          className="font-bold text-base mb-1"
          style={{
            color: "#F9B064",
            fontFamily: "'Cinzel', serif",
          }}
        >
          {reward.title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.7)",
            fontFamily: "'Lato', sans-serif",
          }}
        >
          {reward.description}
        </p>
      </div>
    </div>
  );
}

function MythicBanner() {
  return (
    <div
      className="w-full rounded-2xl px-6 py-4 flex items-center justify-center gap-3 flex-wrap"
      style={{
        background: "rgba(12, 12, 12, 0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(249, 176, 100, 0.3)",
      }}
    >
      <div
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ background: "#F9B064", boxShadow: "0 0 8px #F9B064" }}
      />
      <span
        style={{
          color: "#F9B064",
          fontFamily: "'Cinzel Decorative', serif",
          fontWeight: 700,
          fontSize: "18px",
          letterSpacing: "4px",
          textTransform: "uppercase",
          textShadow: "0 0 12px rgba(249,176,100,0.4)",
        }}
      >
        Mythic Holder Benefits
      </span>
      <div
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ background: "#F9B064", boxShadow: "0 0 8px #F9B064" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export function SpecialRewards() {
  const { address } = useAccount();
  const [tokenIds, setTokenIds] = useState<number[]>([]);
  const [loadingTokenIds, setLoadingTokenIds] = useState(true);

  // Load token IDs from public JSON file (same source as Mint page)
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
  } = useUserGameItemsInventory({
    tokenIds,
    pageSize: 200,
    concurrencyLimit: 8,
  });

  // Filter for Mythic items only
  const mythicItems: GameItem[] = userItems.filter(
    (item) => item.rarity?.toLowerCase() === "mythic",
  );

  const isLoading = loadingTokenIds || loadingInventory;
  const isConnected = !!address;

  return (
    <div className="min-h-full w-full flex flex-col items-center px-4 md:px-8 py-6">
      <div
        className="w-full flex flex-col gap-6"
        style={{ maxWidth: "1100px" }}
      >
        {/* Banner */}
        <MythicBanner />

        {/* Not connected */}
        {!isConnected && (
          <div
            className="rounded-3xl p-8 text-center"
            style={{
              background: "linear-gradient(180deg, #0C0C0C 0%, #181818 100%)",
              border: "3px solid rgba(249, 176, 100, 0.3)",
            }}
          >
            <h2
              className="mb-3 font-bold"
              style={{
                color: "#F9B064",
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: "22px",
                letterSpacing: "2px",
              }}
            >
              Connect Your Wallet
            </h2>
            <p
              className="text-gray-400"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Connect your wallet to check if you hold a Mythic warrior and
              unlock exclusive rewards.
            </p>
          </div>
        )}

        {/* Loading */}
        {isConnected && isLoading && (
          <div
            className="rounded-3xl p-8 text-center"
            style={{
              background: "linear-gradient(180deg, #0C0C0C 0%, #181818 100%)",
              border: "3px solid rgba(249, 176, 100, 0.3)",
            }}
          >
            <p className="text-gray-400 animate-pulse">
              Scanning your inventory for Mythic warriors...
            </p>
          </div>
        )}

        {/* Error */}
        {inventoryError && (
          <div
            className="p-4 rounded-lg text-red-400"
            style={{
              background: "rgba(249, 176, 100, 0.1)",
              border: "1px solid rgba(249, 176, 100, 0.3)",
            }}
          >
            Error loading inventory: {inventoryError}
          </div>
        )}

        {/* No Mythic NFTs */}
        {isConnected && !isLoading && mythicItems.length === 0 && (
          <div
            className="rounded-3xl p-10 text-center"
            style={{
              background: "linear-gradient(180deg, #0C0C0C 0%, #181818 100%)",
              border: "3px solid rgba(249, 176, 100, 0.3)",
            }}
          >
            <div className="text-5xl mb-4">🔒</div>
            <h2
              className="mb-3 font-bold"
              style={{
                color: "#F9B064",
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: "22px",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              No Mythic Warriors Found
            </h2>
            <p
              className="text-gray-400 max-w-lg mx-auto leading-relaxed"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              You don't currently hold any Mythic NFTs. Mythic warriors are the
              rarest tier and unlock exclusive real-world and digital rewards.
              Keep minting to chase the Mythic!
            </p>
            <a
              href="/mint"
              className="inline-block mt-6 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #F9B064 0%, #E8924A 100%)",
                color: "#0C0C0C",
                fontFamily: "'Cinzel', serif",
                fontSize: "14px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Go to Mint
            </a>
          </div>
        )}

        {/* Has Mythic NFTs — show NFTs + rewards */}
        {isConnected && !isLoading && mythicItems.length > 0 && (
          <>
            {/* Mythic NFTs display */}
            <div
              className="rounded-3xl p-6"
              style={{
                background: "linear-gradient(180deg, #0C0C0C 0%, #181818 100%)",
                border: "3px solid rgba(249, 176, 100, 0.35)",
                boxShadow: "0 0 40px rgba(249, 176, 100, 0.08)",
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
                Your Mythic Warriors
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mythicItems.map((item) => (
                  <NftCard key={`${item.tokenId}`} item={item} />
                ))}
              </div>
            </div>

            {/* Rewards grid */}
            <div
              className="rounded-3xl p-6"
              style={{
                background: "linear-gradient(180deg, #0C0C0C 0%, #181818 100%)",
                border: "3px solid rgba(249, 176, 100, 0.25)",
              }}
            >
              <h2
                className="mb-5 font-bold"
                style={{
                  color: "#F9B064",
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: "24px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                Exclusive Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MYTHIC_REWARDS.map((reward) => (
                  <RewardCard key={reward.title} reward={reward} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SpecialRewards;
