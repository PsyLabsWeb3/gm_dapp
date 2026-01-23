/**
 * ProgressTracker - Visual representation of minting progress
 * Creates urgency with animated progress bar
 */

interface ProgressTrackerProps {
    totalSupply: number
    mintedCount: number
}

export function ProgressTracker({ totalSupply, mintedCount }: ProgressTrackerProps) {
    const percentage = totalSupply > 0 ? (mintedCount / totalSupply) * 100 : 0

    return (
        <div
            className="w-full rounded-2xl px-6 py-4"
            style={{
                background: 'rgba(12, 12, 12, 0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(249, 176, 100, 0.2)',
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{
                            background: percentage < 100 ? '#F9B064' : '#4ade80',
                            boxShadow: `0 0 8px ${percentage < 100 ? '#F9B064' : '#4ade80'}`,
                            animation: 'pulse 2s infinite',
                        }}
                    />
                    <span style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontFamily: 'Lato, sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        letterSpacing: '1px',
                    }}>
                        MINTING PROGRESS
                    </span>
                </div>
                <span style={{
                    color: '#F9B064',
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: '16px',
                    fontWeight: 700,
                }}>
                    {percentage.toFixed(1)}%
                </span>
            </div>

            {/* Progress Bar */}
            <div
                className="w-full h-3 rounded-full overflow-hidden"
                style={{ background: 'rgba(249, 176, 100, 0.1)' }}
            >
                <div
                    className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                    style={{
                        width: `${percentage}%`,
                        background: 'linear-gradient(90deg, #93683B 0%, #F9B064 50%, #FFD700 100%)',
                        boxShadow: '0 0 20px rgba(249, 176, 100, 0.5)',
                    }}
                >
                    {/* Shimmer effect */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            animation: 'shimmer 2s infinite',
                        }}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mt-3">
                <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Lato, sans-serif', fontSize: '13px' }}>
                    {mintedCount.toLocaleString()} minted
                </span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Lato, sans-serif', fontSize: '13px' }}>
                    {(totalSupply - mintedCount).toLocaleString()} remaining
                </span>
            </div>

            {/* Inline keyframes */}
            <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
        </div>
    )
}
