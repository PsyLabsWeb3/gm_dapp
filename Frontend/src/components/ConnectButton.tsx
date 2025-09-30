import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'

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
        <div className="px-4 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center h-9">
          <span className="text-xs font-medium">{chain?.name || 'Unknown Network'}</span>
        </div>
        <span className="px-4 bg-green-500/20 text-green-400 rounded-lg font-mono text-sm flex items-center h-9">
          {formatAddress(address)}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-4 h-9 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
    >
      Connect Wallet
    </button>
  )
}