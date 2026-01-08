/**
 * MintStatsBar - Live stats header for the mint page
 * Displays supply, holders count with glassmorphism styling
 */

interface MintStatsBarProps {
  totalSupply: number
  mintedCount: number
  holdersCount: number
}

export function MintStatsBar({ totalSupply, mintedCount, holdersCount }: MintStatsBarProps) {
  const remaining = totalSupply - mintedCount
  
  return (
    <div 
      className="w-full rounded-2xl px-6 py-4 flex items-center justify-between gap-4 flex-wrap"
      style={{
        background: 'rgba(12, 12, 12, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(249, 176, 100, 0.2)',
      }}
    >
      {/* Supply */}
      <div className="flex items-center gap-3">
        <div 
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: '#4ade80', boxShadow: '0 0 8px #4ade80' }}
        />
        <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Lato, sans-serif', fontSize: '14px' }}>
          SUPPLY
        </span>
        <span style={{ color: '#F9B064', fontFamily: "'Cinzel Decorative', serif", fontWeight: 700, fontSize: '18px' }}>
          {mintedCount.toLocaleString()} / {totalSupply.toLocaleString()}
        </span>
      </div>

      {/* Remaining */}
      <div className="flex items-center gap-3">
        <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Lato, sans-serif', fontSize: '14px' }}>
          REMAINING
        </span>
        <span style={{ color: '#FFFFFF', fontFamily: "'Cinzel Decorative', serif", fontWeight: 700, fontSize: '18px' }}>
          {remaining.toLocaleString()}
        </span>
      </div>

      {/* Holders */}
      <div className="flex items-center gap-3">
        <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Lato, sans-serif', fontSize: '14px' }}>
          HOLDERS
        </span>
        <span style={{ color: '#FFFFFF', fontFamily: "'Cinzel Decorative', serif", fontWeight: 700, fontSize: '18px' }}>
          {holdersCount.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
