/**
 * NFTPreviewPanel - Left panel displaying the mystery NFT artwork
 * Features animated glow, particle effects, and trait preview
 */

import badgetIcon from '../../../assets/badget.png'

interface NFTPreviewPanelProps {
    seasonName?: string
}

export function NFTPreviewPanel({ seasonName = 'Season 1' }: NFTPreviewPanelProps) {
    const hiddenTraits = [
        { name: 'Rarity', value: '???' },
        { name: 'Type', value: '???' },
        { name: 'Power', value: '???' },
    ]

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

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                            background: '#F9B064',
                            boxShadow: '0 0 6px #F9B064',
                            left: `${15 + (i * 10)}%`,
                            top: `${20 + (i * 8)}%`,
                            animation: `float-${i % 3} ${3 + i * 0.5}s ease-in-out infinite`,
                            opacity: 0.6,
                        }}
                    />
                ))}
            </div>

            {/* Season Badge */}
            <div className="flex justify-center mb-4">
                <div
                    className="px-4 py-1.5 rounded-full"
                    style={{
                        background: 'rgba(249, 176, 100, 0.15)',
                        border: '1px solid rgba(249, 176, 100, 0.3)',
                    }}
                >
                    <span style={{
                        color: '#F9B064',
                        fontFamily: 'Lato, sans-serif',
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                    }}>
                        ✦ {seasonName} · MAYAN WARRIOR ✦
                    </span>
                </div>
            </div>

            {/* NFT Preview Image */}
            <div className="flex-1 flex items-center justify-center relative">
                {/* Glow effect */}
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                        background: 'radial-gradient(circle, rgba(249, 176, 100, 0.15) 0%, transparent 70%)',
                    }}
                />

                {/* Mystery overlay pulse */}
                <div
                    className="absolute w-72 h-72 rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(249, 176, 100, 0.2) 0%, transparent 70%)',
                        animation: 'pulse-glow 3s ease-in-out infinite',
                    }}
                />

                {/* Image */}
                <img
                    src={badgetIcon}
                    alt="Guerrero Misterioso"
                    className="w-64 h-64 object-contain relative z-10 transition-transform duration-500 hover:scale-105"
                    style={{
                        filter: 'drop-shadow(0 0 40px rgba(249, 176, 100, 0.4))',
                    }}
                />
            </div>

            {/* Mystery Label */}
            <div className="text-center my-2">
                <h3 style={{
                    color: '#F9B064',
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: '24px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                }}>
                    MYSTERY WARRIOR
                </h3>
                <p style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    marginTop: '4px',
                }}>
                    Your warrior shall be revealed upon summoning
                </p>
            </div>

            {/* Traits Preview */}
            <div
                className="rounded-xl p-4 mt-auto"
                style={{
                    background: 'rgba(249, 176, 100, 0.05)',
                    border: '1px solid rgba(249, 176, 100, 0.15)',
                }}
            >
                <div className="text-center mb-3">
                    <span style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontFamily: 'Lato, sans-serif',
                        fontSize: '12px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                    }}>
                        Hidden Attributes
                    </span>
                </div>
                <div className="flex justify-between gap-4">
                    {hiddenTraits.map((trait) => (
                        <div key={trait.name} className="text-center flex-1">
                            <div style={{
                                color: 'rgba(255,255,255,0.4)',
                                fontFamily: 'Lato, sans-serif',
                                fontSize: '11px',
                                marginBottom: '4px',
                            }}>
                                {trait.name}
                            </div>
                            <div style={{
                                color: '#F9B064',
                                fontFamily: "'Cinzel Decorative', serif",
                                fontSize: '16px',
                                fontWeight: 700,
                            }}>
                                {trait.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Inline animations */}
            <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes float-0 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(-8px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-25px) translateX(5px); }
        }
      `}</style>
        </div>
    )
}
