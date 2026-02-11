/**
 * NftCard - Displays a single ERC1155 NFT with metadata
 * Shows image, name, rarity, balance, and attributes
 */

import type { GameItem } from '../lib/erc1155'

interface NftCardProps {
  item: GameItem
  onClick?: () => void
  className?: string
}

export function NftCard({ item, onClick, className = '' }: NftCardProps) {
  const rarityColor = getRarityColor(item.rarity)

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl p-4 cursor-pointer transition-transform hover:scale-105
        ${onClick ? 'hover:shadow-lg' : ''}
        ${className}
      `}
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        border: `2px solid ${rarityColor}40`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gradient border effect */}
      <div
        className="absolute inset-0 -z-10 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${rarityColor} 0%, ${rarityColor}40 100%)`,
          opacity: 0.5,
        }}
      />

      {/* Image Container */}
      <div
        className="w-full h-48 mb-3 rounded-lg overflow-hidden bg-black/50 flex items-center justify-center"
        style={{
          aspectRatio: '1 / 1',
        }}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name || `Token #${item.tokenId}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext x="50%" y="50%" font-size="16" fill="%23999" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E'
            }}
          />
        ) : (
          <div className="text-gray-400 text-center text-sm">No image available</div>
        )}
      </div>

      {/* Content */}
      <div className="text-white space-y-2">
        {/* Name */}
        {item.name && (
          <h3
            className="font-bold text-sm truncate"
            style={{
              color: '#FFFFFF',
              fontFamily: "'Cinzel', serif",
            }}
          >
            {item.name}
          </h3>
        )}

        {/* Token ID */}
        <p
          className="text-xs text-gray-400"
          style={{
            fontFamily: "'Courier New', monospace",
          }}
        >
          #{typeof item.tokenId === 'bigint' ? item.tokenId.toString() : item.tokenId}
        </p>

        {/* Rarity Badge */}
        {item.rarity && (
          <div
            className="inline-block px-2 py-1 rounded text-xs font-semibold"
            style={{
              backgroundColor: `${rarityColor}20`,
              color: rarityColor,
              border: `1px solid ${rarityColor}80`,
            }}
          >
            {item.rarity}
          </div>
        )}

        {/* Balance */}
        {item.balance > 0n && (
          <p
            className="text-xs text-gray-300"
            style={{
              fontFamily: "'Courier New', monospace",
            }}
          >
            Balance: <span className="font-semibold">{item.balance.toString()}</span>
          </p>
        )}

        {/* Attributes */}
        {item.attributes && item.attributes.length > 0 && (
          <div className="space-y-1 mt-3 border-t border-gray-600 pt-2">
            {item.attributes.map((attr, idx) => (
              <div key={idx} className="flex justify-between text-xs text-gray-300">
                <span className="text-gray-400">{attr.trait_type}</span>
                <span className="font-semibold">{attr.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Map rarity values to colors
 */
function getRarityColor(rarity?: string): string {
  if (!rarity) return '#888888'

  const colorMap: Record<string, string> = {
    'common': '#A8A9AD',
    'uncommon': '#1EFF00',
    'rare': '#0070DD',
    'epic': '#A335EE',
    'legendary': '#FF8000',
    'mythic': '#FF0000',
  }

  return colorMap[rarity.toLowerCase()] || '#888888'
}
