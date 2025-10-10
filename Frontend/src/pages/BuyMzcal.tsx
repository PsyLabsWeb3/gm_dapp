import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { useWhitelistStatus } from '../hooks/useWhitelistStatus'
import { usePresaleTokenPrice } from '../hooks/useTokenPrices'
import { useBuyPresale } from '../hooks/useBuyTokens'

export function BuyMzcal() {
  const { address } = useAccount()
  const [amount, setAmount] = useState('')

  // Check whitelist status
  const { data: isWhitelisted } = useWhitelistStatus(address)

  // Get presale token price
  const { priceInWei, priceInEth } = usePresaleTokenPrice()

  // Buy presale hook
  const { buyPresale, isPending, isConfirming, isSuccess, error } = useBuyPresale()

  // Debug log for deployment verification
  useEffect(() => {
    console.log('🚀 BuyMzcal Page Loaded - Deploy Verification')
    console.log('📅 Timestamp:', new Date().toISOString())
    console.log('💰 Price in ETH:', priceInEth)
    console.log('💰 Price in Wei:', priceInWei?.toString())
    console.log('✅ Whitelisted:', isWhitelisted)
    console.log('👤 Address:', address)
  }, [priceInEth, priceInWei, isWhitelisted, address])

  // Calculate MZCAL to receive based on ETH amount
  const calculateMzcal = (ethAmount: string) => {
    const eth = parseFloat(ethAmount)
    const price = parseFloat(priceInEth)
    if (isNaN(eth) || eth <= 0 || price === 0) return '00.00'
    const mzcal = eth / price
    return mzcal.toFixed(2)
  }

  const handleBuy = () => {
    if (!amount || !priceInWei) return

    try {
      const ethAmount = parseEther(amount)
      const tokenAmount = ethAmount / priceInWei

      buyPresale(tokenAmount, ethAmount)
    } catch (err) {
      console.error('Error buying presale:', err)
    }
  }

  // Reset amount on success
  useEffect(() => {
    if (isSuccess) {
      setAmount('')
    }
  }, [isSuccess])

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
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter ETH amount"
                  className="w-full px-6 py-4 text-[#d4af37] placeholder-[#d4af37]/30 text-lg focus:outline-none focus:border-[#d4af37] transition-colors"
                  style={{
                    backgroundColor: 'rgba(147, 104, 59, 0.15)',
                    borderRadius: '20px',
                    border: '1px solid rgba(212, 175, 55, 0.5)',
                    fontFamily: 'Lato, sans-serif',
                  }}
                  disabled={!isWhitelisted || isPending || isConfirming}
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Current Rate */}
              <div className="space-y-2">
                <div
                  className="text-center py-2"
                  style={{
                    color: '#F9B064',
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '16px',
                    fontStyle: 'italic',
                  }}
                >
                  Current rate: 1 $MZCAL = {priceInEth} $ETH
                </div>
              </div>

              {/* Buy Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleBuy}
                  disabled={!isWhitelisted || !amount || isPending || isConfirming}
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
                  {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Buy'}
                </button>
              </div>

              {/* Transaction Status Messages */}
              {isSuccess && (
                <p
                  className="text-center"
                  style={{
                    color: '#4ade80',
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  ✓ Purchase successful!
                </p>
              )}

              {error && (
                <p
                  className="text-center"
                  style={{
                    color: '#ef4444',
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '14px',
                  }}
                >
                  Error: {error.message || 'Transaction failed'}
                </p>
              )}

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
              {amount ? calculateMzcal(amount) : '00.00'}
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
