/**
 * Mint Page - Premium NFT Minting Experience
 * Split-screen layout with stats bar, preview panel, console, and progress tracker
 */

import { useState } from 'react'
import { MintStatsBar } from './components/MintStatsBar'
import { NFTPreviewPanel } from './components/NFTPreviewPanel'
import { MintingConsole } from './components/MintingConsole'

// Mock data - replace with real contract data
const MOCK_DATA = {
    totalSupply: 1000,
    mintedCount: 247,
    holdersCount: 89,
    pricePerMint: 500,
}

export function Mint() {
    const [isMinting, setIsMinting] = useState(false)

    const handleMint = (quantity: number) => {
        setIsMinting(true)
        // Simulate minting process - replace with actual contract call
        setTimeout(() => {
            setIsMinting(false)
            alert(`Successfully summoned ${quantity} Seasonal Artifact(s)!`)
        }, 2500)
    }

    return (
        <div className="h-full w-full flex flex-col items-center justify-center px-4 md:px-8 py-6">
            {/* Centered Container with max-width */}
            <div className="w-full flex flex-col gap-6" style={{ maxWidth: '1100px' }}>
                {/* Stats Bar */}
                <MintStatsBar
                    totalSupply={MOCK_DATA.totalSupply}
                    mintedCount={MOCK_DATA.mintedCount}
                    holdersCount={MOCK_DATA.holdersCount}
                />

                {/* Main Content - Split Screen */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Panel - NFT Preview */}
                    <NFTPreviewPanel seasonName="Season 1" />

                    {/* Right Panel - Minting Console */}
                    <MintingConsole
                        pricePerMint={MOCK_DATA.pricePerMint}
                        tokenSymbol="$MZCAL"
                        onMint={handleMint}
                        isMinting={isMinting}
                        maxQuantity={10}
                    />
                </div>
            </div>
        </div>
    )
}

export default Mint
