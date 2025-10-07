import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useWhitelistStatus } from '../hooks/useWhitelistStatus'

export function BuyMzcal() {
  const { address } = useAccount()
  const [amount, setAmount] = useState('')

  // Check whitelist status
  const { data: isWhitelisted } = useWhitelistStatus(address)

  // Calculate MZCAL to receive (example rate: 1 $MZCAL = 0.01 $ETH)
  const calculateMzcal = (ethAmount: string) => {
    const eth = parseFloat(ethAmount)
    if (isNaN(eth) || eth <= 0) return '00.00'
    const mzcal = eth / 0.01 // 1 MZCAL = 0.01 ETH
    return mzcal.toFixed(2)
  }

  const handleBuy = () => {
    // TODO: Implement buy logic
    console.log('Buy clicked', { amount })
  }

  return (
    <div className="h-full w-full flex items-center justify-center px-8 py-12">
      <div className="max-w-6xl w-full">
        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Card - Input */}
          <div
            className="rounded-3xl p-12 relative"
            style={{
              background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)',
              border: '3px solid transparent',
              backgroundClip: 'padding-box',
            }}
          >
            {/* Gradient border effect */}
            <div
              className="absolute inset-0 rounded-3xl -z-10"
              style={{
                background: 'linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)',
                padding: '3px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude'
              }}
            ></div>

            <h2
              className="text-center mb-12"
              style={{
                color: '#F9B064',
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '32px',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              $MZCAL Presale
            </h2>

            <div className="space-y-8">
              {/* Amount Input */}
              <div>
                <label
                  className="block mb-3"
                  style={{
                    color: 'rgba(255, 255, 255, 0.60)',
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: '18px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  Amount of $ETH to spend
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-6 py-4 text-[#d4af37] placeholder-[#d4af37]/30 text-lg focus:outline-none focus:border-[#d4af37] transition-colors"
                  style={{
                    backgroundColor: 'rgba(147, 104, 59, 0.15)',
                    borderRadius: '20px',
                    border: '1px solid rgba(212, 175, 55, 0.5)',
                    fontFamily: 'Lato, sans-serif',
                  }}
                  disabled={!isWhitelisted}
                />
              </div>

              {/* Current Rate */}
              <div
                className="text-center py-2"
                style={{
                  color: '#F9B064',
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '16px',
                  fontStyle: 'italic',
                }}
              >
                Current rate: 1 $MZCAL = 0.01 $ETH
              </div>

              {/* Buy Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleBuy}
                  disabled={!isWhitelisted}
                  className="rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Lato, sans-serif',
                    fontStyle: 'italic',
                    fontSize: '24px',
                    border: '4px solid transparent',
                    backgroundImage: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%), linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    width: '200px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Buy
                </button>
              </div>

              {/* Whitelist Warning */}
              {!isWhitelisted && address && (
                <p
                  className="text-center"
                  style={{
                    color: '#F9B064',
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '14px',
                    fontStyle: 'italic',
                  }}
                >
                  Your address is not whitelisted for presale
                </p>
              )}

              {/* Connect Wallet Warning */}
              {!address && (
                <p
                  className="text-center"
                  style={{
                    color: '#F9B064',
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '14px',
                    fontStyle: 'italic',
                  }}
                >
                  Please connect your wallet to continue
                </p>
              )}
            </div>
          </div>

          {/* Right Card - You Will Receive */}
          <div
            className="rounded-3xl p-12 relative flex flex-col items-center justify-center"
            style={{
              background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)',
              border: '3px solid transparent',
              backgroundClip: 'padding-box',
            }}
          >
            {/* Gradient border effect */}
            <div
              className="absolute inset-0 rounded-3xl -z-10"
              style={{
                background: 'linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)',
                padding: '3px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude'
              }}
            ></div>

            <h2
              className="text-center mb-8"
              style={{
                color: '#F9B064',
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '32px',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              You will receive
            </h2>

            <div
              className="text-center mb-8"
              style={{
                color: 'rgba(255, 255, 255, 0.80)',
                fontFamily: 'Lato, sans-serif',
                fontSize: '72px',
                fontWeight: 300,
              }}
            >
              {calculateMzcal(amount)}
            </div>

            <div
              style={{
                color: '#F9B064',
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '48px',
                fontWeight: 700,
              }}
            >
              $MZCAL
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
