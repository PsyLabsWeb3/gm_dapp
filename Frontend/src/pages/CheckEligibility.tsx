import { useState } from 'react'
import { useAccount } from 'wagmi'
import { isAddress } from 'viem'
import { useWhitelistStatus } from '../hooks/useWhitelistStatus'
import badgetIcon from '../assets/badget.png'

export function CheckEligibility() {
  const { address: connectedAddress } = useAccount()
  const [inputAddress, setInputAddress] = useState('')
  const [addressToCheck, setAddressToCheck] = useState<`0x${string}` | ''>('')
  const [error, setError] = useState('')

  // Auto-fill with connected address
  const effectiveAddress = connectedAddress || inputAddress

  // Call the hook to check whitelist status
  const result = useWhitelistStatus(addressToCheck as `0x${string}`)
  const isWhitelisted = result.data as boolean | undefined
  // const isWhitelisted = false // TODO: REMOVE THIS - Testing only
  const isLoading = result.isLoading
  const isError = result.isError
  const contractError = result.error as Error | null

  const handleCheck = () => {
    setError('')

    if (!effectiveAddress) {
      setError('Please enter an address or connect your wallet')
      return
    }

    if (!isAddress(effectiveAddress)) {
      setError('Invalid Ethereum address')
      return
    }

    setAddressToCheck(effectiveAddress as `0x${string}`)
  }

  return (
    <div className="min-h-full w-full flex items-center justify-center px-8 py-12 relative"
    >

      <div
        className="max-w-3xl w-full rounded-3xl p-20 relative z-30"
        style={{
          background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)',
          border: '3px solid transparent',
          backgroundClip: 'padding-box',
          position: 'relative'
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
        <h2 className="text-3xl font-bold mb-12 text-center tracking-wider" style={{ color: '#F9B064' }}>
          <span style={{ fontFamily: "'Cinzel Decorative', serif", fontWeight: 700 }}>$MZCAL Presale whitelist</span>
        </h2>

        {/* Address Input Section - Only show if no result yet */}
        {!addressToCheck && (
          <>
            <div className="mb-12">
              <label
                className="block mb-3"
                style={{
                  color: 'rgba(255, 255, 255, 0.60)',
                  textAlign: 'left',
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: '24px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: 'normal',
                  textTransform: 'lowercase',
                }}
              >
                {connectedAddress ? 'Connected Address' : 'Enter Address'}
              </label>

              {connectedAddress ? (
                <div className="font-mono text-base text-[#d4af37] px-6 py-3 break-all border border-[#d4af37]/30" style={{ backgroundColor: 'rgba(147, 104, 59, 0.15)', borderRadius: '20px' }}>
                  {connectedAddress}
                </div>
              ) : (
                <input
                  type="text"
                  value={inputAddress}
                  onChange={(e) => setInputAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full border border-[#d4af37]/50 px-6 py-3 text-[#d4af37] placeholder-[#d4af37]/30 font-mono text-base focus:outline-none focus:border-[#d4af37] transition-colors"
                  style={{ backgroundColor: 'rgba(147, 104, 59, 0.15)', borderRadius: '20px' }}
                />
              )}

              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>

            {/* Check Button */}
            <div className="flex justify-center mb-12">
              <button
                onClick={handleCheck}
                className="rounded-xl transition-all"
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Lato, sans-serif',
                  fontStyle: 'italic',
                  fontSize: '27px',
                  // fontWeight: 200,
                  border: '4px solid transparent',
                  backgroundImage: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%), linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                  width: '330px',
                  height: '70px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundImage = 'linear-gradient(180deg, #181818 0%, #1a1a1a 100%), linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundImage = 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%), linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)'
                }}
              >
                Check Elegibility
              </button>
            </div>
          </>
        )}

        {/* Result Section */}
        {addressToCheck && (
          <div className="space-y-4">
            {/* Loading State */}
            {isLoading && (
              <div className="bg-[#1a1a1a] border border-[#d4af37]/30 rounded-xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <svg
                    className="h-8 w-8 text-[#d4af37] animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
                <p className="text-[#d4af37] font-medium text-center">
                  Checking eligibility...
                </p>
                <div className="mt-4 pt-4 border-t border-[#d4af37]/20">
                  <p className="text-xs text-[#d4af37]/60 text-center break-all font-mono">
                    {addressToCheck}
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="bg-[#1a1a1a] border border-red-500/50 rounded-xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <svg
                    className="h-8 w-8 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-red-500 font-medium text-center mb-2">
                  Error checking eligibility
                </p>
                <p className="text-red-400/70 text-sm text-center">
                  {contractError?.message || 'Unable to connect to contract'}
                </p>
              </div>
            )}

            {/* Success State - Whitelisted */}
            {!isLoading && !isError && isWhitelisted && (
              <div className="text-center space-y-8">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <img src={badgetIcon} alt="Badge" className="w-24 h-24" />
                </div>

                {/* Message */}
                <div className="space-y-4">
                  <p
                    className="text-2xl text-center"
                    style={{
                      color: 'rgba(255, 255, 255, 0.80)',
                      fontFamily: "'Cinzel Decorative', serif",
                      fontSize: '28px',
                      fontWeight: 700,
                      lineHeight: '1.4',
                      textTransform: 'lowercase'
                    }}
                  >
                    The spirits favor you.
                  </p>
                  <p
                    className="text-2xl text-center"
                    style={{
                      color: '#F9B064',
                      fontFamily: "'Cinzel Decorative', serif",
                      fontSize: '28px',
                      fontWeight: 700,
                      lineHeight: '1.4',
                      textTransform: 'lowercase'
                    }}
                  >
                    Your address is on the whitelist
                  </p>
                </div>
              </div>
            )}

            {/* Success State - Not Whitelisted */}
            {!isLoading && !isError && isWhitelisted === false && (
              <div className="space-y-6">
                {/* Address Display */}
                <div>
                  <label
                    className="block mb-3"
                    style={{
                      color: 'rgba(255, 255, 255, 0.60)',
                      textAlign: 'left',
                      fontFamily: "'Cinzel Decorative', serif",
                      fontSize: '24px',
                      fontStyle: 'normal',
                      fontWeight: 700,
                      lineHeight: 'normal',
                      textTransform: 'lowercase',
                    }}
                  >
                    enter address
                  </label>
                  <div
                    className="w-full px-6 py-3 font-mono text-base break-all"
                    style={{
                      backgroundColor: 'rgba(147, 104, 59, 0.15)',
                      borderRadius: '20px',
                      border: '1px solid rgba(212, 175, 55, 0.5)',
                      color: '#d4af37'
                    }}
                  >
                    {addressToCheck}
                  </div>
                </div>

                {/* Error Message */}
                <p
                  className="text-left"
                  style={{
                    color: '#F9B064',
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '22px',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    lineHeight: '1.6',
                  }}
                >
                  Unfortunately, this address is not eligible for the current whitelist. However, new portals will open soon... Stay tuned to our communication channels.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}