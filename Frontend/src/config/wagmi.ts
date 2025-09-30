import { http, createConfig } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'


// next: adding walletconnect: https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || ''

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