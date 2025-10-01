import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function ConnectButton() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  // Función para formatear la dirección (0x1234...5678)
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-4 bg-[#1a1a1a] text-[#d4af37] rounded-lg flex items-center justify-center h-9 border border-[#d4af37]/30">
          <span className="text-xs font-medium">{chain?.name || 'Unknown Network'}</span>
        </div>
        <span className="px-4 bg-[#1a1a1a] text-[#d4af37] rounded-lg font-mono text-sm flex items-center h-9 border border-[#d4af37]/30">
          {formatAddress(address)}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-4 h-9 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#d4af37] rounded-lg transition-colors flex items-center justify-center border border-[#d4af37]/50 hover:border-[#d4af37]"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="bg-[#0C0C0C] hover:bg-[#181818] rounded-lg transition-all text-sm relative"
      style={{
        color: '#F9B064',
        fontFamily: 'Lato, sans-serif',
        fontWeight: 400,
        border: '4px solid transparent',
        backgroundImage: 'linear-gradient(#0C0C0C, #0C0C0C), linear-gradient(90deg, #F9B064 0%, rgba(249, 176, 100, 0.5) 100%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        height: '32px',
        width: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundImage = 'linear-gradient(#181818, #181818), linear-gradient(90deg, #F9B064 0%, rgba(249, 176, 100, 0.5) 100%)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundImage = 'linear-gradient(#0C0C0C, #0C0C0C), linear-gradient(90deg, #F9B064 0%, rgba(249, 176, 100, 0.5) 100%)'
      }}
    >
      Connect Wallet
    </button>
  )
}