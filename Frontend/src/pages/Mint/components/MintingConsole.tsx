/**
 * MintingConsole - Right panel with minting controls
 * Includes quantity selector, price display, action button, and trust badge
 */

import { useState } from 'react'
import { QuantitySelector } from './QuantitySelector'

interface MintingConsoleProps {
    pricePerMint: number
    tokenSymbol?: string
    onMint: (quantity: number) => void
    isMinting?: boolean
    maxQuantity?: number
}

export function MintingConsole({
    pricePerMint,
    tokenSymbol = '$MZCAL',
    onMint,
    isMinting = false,
    maxQuantity = 10,
}: MintingConsoleProps) {
    const [quantity, setQuantity] = useState(1)
    const totalPrice = quantity * pricePerMint

    const handleMint = () => {
        if (!isMinting) {
            onMint(quantity)
        }
    }

    return (
        <div
            className="rounded-3xl p-6 relative overflow-hidden h-full flex flex-col"
            style={{
                background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)',
                border: '3px solid transparent',
                backgroundClip: 'padding-box',
            }}
        >
            {/* Gradient border effect */}
            <div
                className="absolute inset-0 rounded-3xl -z-10"
                style={{
                    background: 'linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)',
                    padding: '3px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />

            {/* Header */}
            <div className="text-center mb-4">
                <h2 style={{
                    color: '#F9B064',
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: '32px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                }}>
                    Summon Your
                </h2>
                <h2 style={{
                    color: '#FFFFFF',
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: '32px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginTop: '4px',
                }}>
                    Warrior
                </h2>
            </div>

            {/* Description */}
            <p
                className="text-center mb-4"
                style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    maxWidth: '300px',
                    margin: '0 auto 1rem',
                }}
            >
                The ancient spirits await your call. Offer your {tokenSymbol} to summon a unique warrior from the sacred realm.
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
                    background: 'rgba(249, 176, 100, 0.08)',
                    border: '1px solid rgba(249, 176, 100, 0.2)',
                }}
            >
                <div style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '13px',
                    marginBottom: '8px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                }}>
                    Total Cost
                </div>
                <div className="flex items-baseline justify-center gap-2">
                    <span style={{
                        color: '#FFFFFF',
                        fontFamily: "'Cinzel Decorative', serif",
                        fontSize: '36px',
                        fontWeight: 300,
                    }}>
                        {totalPrice.toLocaleString()}
                    </span>
                    <span style={{
                        color: '#F9B064',
                        fontFamily: "'Cinzel Decorative', serif",
                        fontSize: '24px',
                        fontWeight: 700,
                    }}>
                        {tokenSymbol}
                    </span>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={handleMint}
                disabled={isMinting}
                className="w-full py-4 rounded-xl transition-all duration-300 cursor-pointer disabled:cursor-not-allowed relative overflow-hidden group"
                style={{
                    background: isMinting
                        ? 'rgba(249, 176, 100, 0.2)'
                        : 'linear-gradient(180deg, #F9B064 0%, #93683B 100%)',
                    border: 'none',
                    boxShadow: isMinting ? 'none' : '0 0 30px rgba(249, 176, 100, 0.3)',
                }}
            >
                {/* Hover glow effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                    }}
                />

                {isMinting ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-[#F9B064] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-[#F9B064] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-[#F9B064] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                ) : (
                    <span style={{
                        color: '#0C0C0C',
                        fontFamily: "'Cinzel Decorative', serif",
                        fontSize: '20px',
                        fontWeight: 700,
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        position: 'relative',
                    }}>
                        ✦ SUMMON NOW ✦
                    </span>
                )}
            </button>
        </div>
    )
}
