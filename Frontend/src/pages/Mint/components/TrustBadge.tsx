/**
 * TrustBadge - Contract verification and explorer links
 * Builds user trust with transparency indicators
 */

interface TrustBadgeProps {
    contractAddress?: string
    explorerUrl?: string
    isVerified?: boolean
}

export function TrustBadge({
    contractAddress = '0x...Coming Soon',
    explorerUrl,
    isVerified = true
}: TrustBadgeProps) {
    const truncatedAddress = contractAddress.length > 12
        ? `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}`
        : contractAddress

    return (
        <div
            className="w-full rounded-xl p-4 space-y-3"
            style={{
                background: 'rgba(249, 176, 100, 0.05)',
                border: '1px solid rgba(249, 176, 100, 0.15)',
            }}
        >
            {/* Verified Badge */}
            <div className="flex items-center gap-2">
                <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                        background: isVerified ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    }}
                >
                    {isVerified ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M3 9L9 3M3 3L9 9" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    )}
                </div>
                <span style={{
                    color: isVerified ? '#4ade80' : '#ef4444',
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                }}>
                    {isVerified ? 'Contract Verified' : 'Unverified'}
                </span>
            </div>

            {/* Contract Address */}
            <div className="flex items-center justify-between">
                <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Lato, sans-serif', fontSize: '12px' }}>
                    Contract
                </span>
                {explorerUrl ? (
                    <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        style={{ color: '#F9B064', fontFamily: 'monospace', fontSize: '13px' }}
                    >
                        {truncatedAddress}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M4 2H2V10H10V8M7 2H10V5M10 2L5 7" stroke="#F9B064" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                ) : (
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: '13px' }}>
                        {truncatedAddress}
                    </span>
                )}
            </div>
        </div>
    )
}
