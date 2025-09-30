import { useState } from 'react'
import { useAccount } from 'wagmi'
import { isAddress } from 'viem'

export function CheckEligibility() {
  const { address: connectedAddress } = useAccount()
  const [inputAddress, setInputAddress] = useState('')
  const [addressToCheck, setAddressToCheck] = useState<string>('')
  const [error, setError] = useState('')

  // Auto-fill with connected address
  const effectiveAddress = connectedAddress || inputAddress

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

    setAddressToCheck(effectiveAddress)
    // TODO: In GM-47, this will trigger the useWhitelistStatus hook
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-8 py-12">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Check Eligibility
        </h2>

        {/* Address Input Section */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">
            {connectedAddress ? 'Connected Address:' : 'Enter Address:'}
          </label>

          {connectedAddress ? (
            <div className="font-mono text-sm text-green-400 bg-green-500/10 px-4 py-3 rounded-lg break-all border border-green-500/20">
              {connectedAddress}
            </div>
          ) : (
            <input
              type="text"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          )}

          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Check Button */}
        <button
          onClick={handleCheck}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors mb-6"
        >
          Check Eligibility
        </button>

        {/* Result Section */}
        {addressToCheck && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
            <div className="flex items-center justify-center mb-3">
              <svg
                className="h-8 w-8 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-yellow-500 font-medium text-center">
              Checking eligibility...
            </p>
            <p className="text-yellow-400/70 text-sm mt-2 text-center">
              Hook will be implemented in GM-47
            </p>
            <div className="mt-4 pt-4 border-t border-yellow-500/20">
              <p className="text-xs text-gray-400 text-center break-all">
                Checking: {addressToCheck}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}