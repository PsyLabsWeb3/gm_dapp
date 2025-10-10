import { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import { useLocation } from 'react-router-dom'
import { parseEther } from 'viem'
import toast from 'react-hot-toast'
import { useWhitelistStatus } from '../hooks/useWhitelistStatus'
import { usePresaleTokenPrice } from '../hooks/useTokenPrices'
import { useBuyPresale } from '../hooks/useBuyTokens'

export function BuyMzcal() {
  const { address } = useAccount()
  const location = useLocation()
  const [amount, setAmount] = useState('')
  const [purchasedAmount, setPurchasedAmount] = useState('')
  const noWalletToastShown = useRef(false)
  const notWhitelistedToastShown = useRef(false)
  const noWalletToastId = useRef<string | null>(null)

  // Check whitelist status
  const { data: isWhitelisted } = useWhitelistStatus(address)

  // Get presale token price
  const { priceInWei, priceInEth } = usePresaleTokenPrice()

  // Buy presale hook
  const { buyPresale, isPending, isConfirming, isSuccess, error, hash } = useBuyPresale()

  // Debug log for deployment verification
  useEffect(() => {
    console.log('🚀 BuyMzcal Page Loaded - Deploy Verification')
    console.log('📅 Timestamp:', new Date().toISOString())
    console.log('💰 Price in ETH:', priceInEth)
    console.log('💰 Price in Wei:', priceInWei?.toString())
    console.log('✅ Whitelisted:', isWhitelisted)
    console.log('👤 Address:', address)
  }, [priceInEth, priceInWei, isWhitelisted, address])

  // Show toast when user has no wallet connected
  useEffect(() => {
    // Small delay to ensure clean mount
    const timer = setTimeout(() => {
      if (!address && !noWalletToastShown.current) {
        const toastId = toast.error('The portal awaits: Connect your wallet to access the presale', {
          duration: 6000,
        })
        noWalletToastId.current = toastId
        noWalletToastShown.current = true
      }
    }, 100)

    // Dismiss toast immediately when wallet is connected
    if (address && noWalletToastId.current) {
      toast.dismiss(noWalletToastId.current)
      noWalletToastId.current = null
    }

    return () => clearTimeout(timer)
  }, [address])

  // Show toast when user is not whitelisted
  useEffect(() => {
    // Small delay to ensure clean mount
    const timer = setTimeout(() => {
      if (address && isWhitelisted === false && !notWhitelistedToastShown.current) {
        toast.error('The portal remains closed: Your address is not on the presale whitelist', {
          duration: 6000,
        })
        notWhitelistedToastShown.current = true
      }
    }, 100)

    // Reset whitelist toast flag when user disconnects
    if (!address) {
      notWhitelistedToastShown.current = false
    }

    return () => clearTimeout(timer)
  }, [address, isWhitelisted])

  // Cleanup toasts when leaving the page (unmount only)
  useEffect(() => {
    return () => {
      // Only cleanup when component unmounts (user leaves /buy page)
      toast.dismiss()
      noWalletToastShown.current = false
      notWhitelistedToastShown.current = false
      noWalletToastId.current = null
    }
  }, [])

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

  // Save purchased amount on success
  useEffect(() => {
    if (isSuccess && amount) {
      setPurchasedAmount(calculateMzcal(amount))
    }
  }, [isSuccess, amount])

  // Handler to reset and buy more
  const handleBuyMore = () => {
    setAmount('')
    setPurchasedAmount('')
  }

  return (
    <div className="h-full w-full flex items-center justify-center px-8 py-12">
      <div className="max-w-6xl w-full">
        {/* Congratulations Card - Show when purchase is successful */}
        {(isSuccess && purchasedAmount) ? (
          <div className="mx-auto" style={{ maxWidth: '1000px' }}>
            <div
              className="rounded-3xl relative z-30"
              style={{
                background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)',
                border: '3px solid transparent',
                backgroundClip: 'padding-box',
                position: 'relative',
                minHeight: '500px',
                padding: '4rem'
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

              <div className="text-center space-y-8">
                {/* Title */}
                <h1
                  style={{
                    color: '#F9B064',
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: '50px',
                    fontWeight: 700,
                    // textTransform: 'lowercase',
                    marginBottom: '24px'
                  }}
                >
                  Congratulations!
                </h1>

                {/* Subtitle */}
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.80)',
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: '25px',
                    fontWeight: 400,
                    lineHeight: '1.6',
                    marginBottom: '32px'
                  }}
                >
                  The portal has opened in your favor.<br />
                  Your offering has been received.
                </p>

                {/* Amount purchased */}
                <div className="flex items-center justify-center gap-4 my-8 mt-12">
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.80)',
                      fontFamily: "'Cinzel Decorative', serif",
                      fontSize: '80px',
                      fontWeight: 300,
                    }}
                  >
                    {purchasedAmount}
                  </span>
                  <span
                    style={{
                      color: '#F9B064',
                      fontFamily: "'Cinzel Decorative', serif",
                      fontSize: '80px',
                      fontWeight: 700,
                    }}
                  >
                    $MZCAL
                  </span>
                </div>

                {/* Thank you message */}
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.60)',
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: '25px',
                    fontWeight: 400,
                    letterSpacing: '1px',
                    marginTop: '28px',
                    marginBottom: '40px'
                  }}
                >
                  Thank you for supporting Guerrero Maya presale
                </p>

                {/* Buttons */}
                <div className="flex justify-center gap-6 mt-26">
                  {/* Buy More Button */}
                  <button
                    onClick={handleBuyMore}
                    className="rounded-xl transition-all"
                    style={{
                      color: '#F9B064',
                      fontFamily: 'Lato, sans-serif',
                      fontStyle: 'italic',
                      fontSize: '18px',
                      border: '4px solid transparent',
                      backgroundImage: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%), linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box',
                      width: '200px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    Buy More
                  </button>

                  {/* View Transaction Button */}
                  {hash && (
                    <a
                      href={`https://sepolia.arbiscan.io/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl transition-all"
                      style={{
                        color: '#FFFFFF',
                        fontFamily: 'Lato, sans-serif',
                        fontStyle: 'italic',
                        fontSize: '18px',
                        border: '4px solid transparent',
                        backgroundImage: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%), linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                        width: '200px',
                        height: '45px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none'
                      }}
                    >
                      view transaction
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Content Grid - Original buy cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Card - Input */}
          <div
            className="rounded-3xl p-12 relative z-30"
            style={{
              background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)',
              border: '3px solid transparent',
              backgroundClip: 'padding-box',
              position: 'relative',
              minHeight: '600px'
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

            <div className="flex flex-col items-center space-y-8">
              {/* Amount Input */}
              <div>
                <label
                  className="block mb-4 mt-16"
                  style={{
                    color: 'rgba(255, 255, 255, 0.60)',
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: '22px',
                    fontWeight: 400,
                    // textTransform: 'lowercase',
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
              <div className="w-full max-w-md">
                <div
                  className="text-center py-2"
                  style={{
                    color: '#F9B064',
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: '16px',
                    fontWeight: 700,
                    textTransform: 'lowercase',
                  }}
                >
                  Current rate: 1 $MZCAL = {priceInEth} $ETH
                </div>
              </div>

              {/* Buy Button */}
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleBuy}
                  disabled={!isWhitelisted || !amount || isPending || isConfirming}
                  className="rounded-xl transition-all disabled:cursor-not-allowed"
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
            </div>
          </div>

          {/* Right Card - You Will Receive */}
          <div
            className="rounded-3xl p-12 relative z-30 flex flex-col items-center justify-center"
            style={{
              background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)',
              border: '3px solid transparent',
              backgroundClip: 'padding-box',
              position: 'relative',
              minHeight: '600px'
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
              className="text-center mb-20"
              style={{
                color: '#F9B064',
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '38px',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              You will receive
            </h2>

            <div
              className="text-center mb-20"
              style={{
                color: 'rgba(255, 255, 255, 0.80)',
                fontFamily: "'Cinzel Decorative', serif",
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
                fontSize: '80px',
                fontWeight: 700,
              }}
            >
              $MZCAL
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
