import { useState } from 'react'
import { useAccount } from 'wagmi'
import { isAddress } from 'viem'
import { useWhitelistStatus } from '../hooks/useWhitelistStatus'

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
    <div className="min-h-screen bg-black flex items-center justify-center px-8 py-12">
      <div className="max-w-xl w-full bg-black border-2 border-[#d4af37] rounded-3xl p-12">
        <h2 className="text-2xl font-bold text-[#d4af37] mb-8 text-center tracking-wider">
          $MZCAL PRESALE WHITELIST
        </h2>

        {/* Address Input Section */}
        <div className="mb-8">
          <label className="block text-xs text-[#d4af37]/70 mb-3 uppercase tracking-wide">
            {connectedAddress ? 'Connected Address' : 'Enter Address'}
          </label>

          {connectedAddress ? (
            <div className="font-mono text-sm text-[#d4af37] bg-[#1a1a1a] px-5 py-4 rounded-xl break-all border border-[#d4af37]/30">
              {connectedAddress}
            </div>
          ) : (
            <input
              type="text"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-[#1a1a1a] border border-[#d4af37]/50 rounded-xl px-5 py-4 text-[#d4af37] placeholder-[#d4af37]/30 font-mono text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
            />
          )}

          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Check Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleCheck}
            className="px-12 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#d4af37] rounded-xl transition-colors border border-[#d4af37]/50 hover:border-[#d4af37] text-sm"
          >
            Check Eligibility
          </button>
        </div>

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
              <div className="bg-[#1a1a1a] border border-[#d4af37] rounded-xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <svg
                    className="h-12 w-12 text-[#d4af37]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-[#d4af37] font-bold text-xl text-center mb-2">
                  ✅ You are eligible!
                </p>
                <p className="text-[#d4af37]/70 text-sm text-center">
                  This address is whitelisted for the presale
                </p>
                <div className="mt-4 pt-4 border-t border-[#d4af37]/20">
                  <p className="text-xs text-[#d4af37]/60 text-center break-all font-mono">
                    {addressToCheck}
                  </p>
                </div>
              </div>
            )}

            {/* Success State - Not Whitelisted */}
            {!isLoading && !isError && isWhitelisted === false && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <div className="flex items-center justify-center mb-3">
                  <svg
                    className="h-12 w-12 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-red-500 font-bold text-xl text-center mb-2">
                  ❌ Not eligible
                </p>
                <p className="text-red-400/70 text-sm text-center">
                  This address is not whitelisted for the presale
                </p>
                <div className="mt-4 pt-4 border-t border-red-500/20">
                  <p className="text-xs text-gray-400 text-center break-all">
                    Address: {addressToCheck}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}