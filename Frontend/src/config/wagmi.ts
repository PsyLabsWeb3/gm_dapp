import { http, createConfig } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [arbitrumSepolia],
  connectors: [
    injected({ target: 'metaMask' }),
    // walletConnect({ projectId }),
  ],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
})