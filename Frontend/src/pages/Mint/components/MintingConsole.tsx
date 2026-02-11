/**
 * MintingConsole - Right panel with minting controls
 * Includes quantity selector, price display, action button, and trust badge
 */

import { useState } from "react";
import { QuantitySelector } from "./QuantitySelector";

interface MintingConsoleProps {
  pricePerMint: number;
  tokenSymbol?: string;
  onMint: (quantity: number) => void;
  onApprove?: () => void;
  isMinting?: boolean;
  isApproving?: boolean;
  isApproved?: boolean;
  userBalance?: number;
  maxQuantity?: number;
  isConnected?: boolean;
  errorMessage?: string;
  onClearError?: () => void;
  successMessage?: string;
  onClearSuccess?: () => void;
}

export function MintingConsole({
  pricePerMint,
  tokenSymbol = "$MZCAL",
  onMint,
  onApprove,
  isMinting = false,
  isApproving = false,
  isApproved = false,
  userBalance = 0,
  maxQuantity = 10,
  isConnected = false,
  errorMessage,
  onClearError,
  successMessage,
  onClearSuccess,
}: MintingConsoleProps) {
  const [quantity, setQuantity] = useState(1);
  const totalPrice = quantity * pricePerMint;
  const hasEnoughBalance = userBalance >= totalPrice;

  const handleMint = () => {
    if (!isMinting && !isApproving) {
      onMint(quantity);
    }
  };

  const handleApprove = () => {
    if (onApprove && !isApproving) {
      onApprove();
    }
  };

  const getButtonContent = () => {
    if (!isConnected) {
      return "✦ CONNECT WALLET ✦";
    }
    if (isApproving) {
      return (
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-2 h-2 bg-[#F9B064] rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-[#F9B064] rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-[#F9B064] rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      );
    }
    if (!isApproved) {
      return "✦ APPROVE MZCAL ✦";
    }
    if (isMinting) {
      return (
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-2 h-2 bg-[#F9B064] rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-[#F9B064] rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-[#F9B064] rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      );
    }
    if (!hasEnoughBalance) {
      return "✦ INSUFFICIENT BALANCE ✦";
    }
    return "✦ SUMMON NOW ✦";
  };

  const isButtonDisabled =
    !isConnected ||
    isApproving ||
    isMinting ||
    (!isApproved && !onApprove) ||
    (!hasEnoughBalance && isApproved);

  return (
    <div
      className="rounded-3xl p-6 relative overflow-hidden h-full flex flex-col"
      style={{
        background: "linear-gradient(180deg, #0C0C0C 0%, #181818 100%)",
        border: "3px solid transparent",
        backgroundClip: "padding-box",
      }}
    >
      {/* Gradient border effect */}
      <div
        className="absolute inset-0 rounded-3xl -z-10"
        style={{
          background:
            "linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)",
          padding: "3px",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Header */}
      <div className="text-center mb-4">
        <h2
          style={{
            color: "#F9B064",
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "32px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Summon Your
        </h2>
        <h2
          style={{
            color: "#FFFFFF",
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "32px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginTop: "4px",
          }}
        >
          Warrior
        </h2>
      </div>

      {/* Description */}
      <p
        className="text-center mb-4"
        style={{
          color: "rgba(255,255,255,0.6)",
          fontFamily: "Lato, sans-serif",
          fontSize: "14px",
          lineHeight: "1.5",
          maxWidth: "300px",
          margin: "0 auto 1rem",
        }}
      >
        The ancient spirits await your call. Offer your {tokenSymbol} to summon
        a unique warrior from the sacred realm.
      </p>

      {/* Quantity Selector */}
      <div className="mb-4">
        <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
          maxQuantity={maxQuantity}
        />
      </div>

      {/* Price Display */}
      <div
        className="text-center py-3 px-4 rounded-xl mb-4"
        style={{
          background: "rgba(249, 176, 100, 0.08)",
          border: "1px solid rgba(249, 176, 100, 0.2)",
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontFamily: "Lato, sans-serif",
            fontSize: "13px",
            marginBottom: "8px",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Total Cost
        </div>
        <div className="flex items-baseline justify-center gap-2">
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "36px",
              fontWeight: 300,
            }}
          >
            {totalPrice.toLocaleString()}
          </span>
          <span
            style={{
              color: "#F9B064",
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            {tokenSymbol}
          </span>
        </div>
        {/* Balance Display */}
        {isConnected && (
          <div
            style={{
              color: hasEnoughBalance ? "rgba(255,255,255,0.6)" : "#ff4444",
              fontFamily: "Lato, sans-serif",
              fontSize: "12px",
              marginTop: "8px",
            }}
          >
            Your Balance: {userBalance.toLocaleString()} {tokenSymbol}
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div
          className="mb-4 p-3 rounded-xl flex items-start gap-2 relative group"
          style={{
            background: "rgba(255, 68, 68, 0.1)",
            border: "1px solid rgba(255, 68, 68, 0.3)",
          }}
        >
          <div className="flex-1">
            <div
              style={{
                color: "#ff4444",
                fontFamily: "Lato, sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "2px",
              }}
            >
              Summoning Error
            </div>
            <div
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontFamily: "Lato, sans-serif",
                fontSize: "13px",
                lineHeight: "1.4",
              }}
            >
              {errorMessage}
            </div>
          </div>
          {onClearError && (
            <button
              onClick={onClearError}
              className="text-white/40 hover:text-white/90 transition-colors bg-transparent border-none cursor-pointer p-1"
              title="Clear error"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div
          className="mb-4 p-3 rounded-xl flex items-start gap-2 relative"
          style={{
            background: "rgba(74, 222, 128, 0.1)",
            border: "1px solid rgba(74, 222, 128, 0.3)",
          }}
        >
          <div className="flex-1">
            <div
              style={{
                color: "#4ade80",
                fontFamily: "Lato, sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "2px",
              }}
            >
              Holy Success
            </div>
            <div
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontFamily: "Lato, sans-serif",
                fontSize: "13px",
                lineHeight: "1.4",
              }}
            >
              {successMessage}
            </div>
          </div>
          {onClearSuccess && (
            <button
              onClick={onClearSuccess}
              className="text-white/40 hover:text-white/90 transition-colors bg-transparent border-none cursor-pointer p-1"
              title="Clear message"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={!isApproved ? handleApprove : handleMint}
        disabled={isButtonDisabled}
        className="w-full py-4 rounded-xl transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden group"
        style={{
          background:
            isApproving || isMinting || isButtonDisabled
              ? "rgba(249, 176, 100, 0.2)"
              : "linear-gradient(180deg, #F9B064 0%, #93683B 100%)",
          border: "none",
          boxShadow:
            isApproving || isMinting || isButtonDisabled
              ? "none"
              : "0 0 30px rgba(249, 176, 100, 0.3)",
        }}
      >
        {/* Hover glow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)",
          }}
        />

        <span
          style={{
            color: "#0C0C0C",
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "3px",
            textTransform: "uppercase",
            position: "relative",
          }}
        >
          {getButtonContent()}
        </span>
      </button>
    </div>
  );
}
