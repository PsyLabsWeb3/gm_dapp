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
      className="px-6 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#d4af37] rounded-lg transition-colors border border-[#d4af37]/50 hover:border-[#d4af37] text-sm"
    >
      Connect Wallet
    </button>
  )
}