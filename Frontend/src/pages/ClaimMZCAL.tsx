import { useAccount } from 'wagmi'
import { usePresaleTokenBalance } from '../hooks/useTokenBalance'
import { useClaimMZCAL } from '../hooks/useBuyTokens'

export function ClaimMZCAL() {
  const { address } = useAccount()
  const { formattedBalance, isLoading } = usePresaleTokenBalance(address)
  const { claimMZCAL, isPending, isConfirming, isSuccess, error } = useClaimMZCAL()

  const handleClaim = () => {
    if (!address || !formattedBalance || parseFloat(formattedBalance) === 0) return
    claimMZCAL()
  }

  const hasBalance = formattedBalance && parseFloat(formattedBalance) > 0

  return (
    <div className="min-h-full w-full flex items-center justify-center px-8 py-12">
      <div className="mx-auto" style={{ maxWidth: '1000px' }}>
        <div
          className="rounded-3xl relative z-30"
          style={{
            background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)',
            border: '3px solid transparent',
            backgroundClip: 'padding-box',
            position: 'relative',
            minHeight: '500px',
            padding: '4rem',
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
              maskComposite: 'exclude',
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
                marginBottom: '24px',
              }}
            >
              Claim Your $MZCAL
            </h1>

            {/* Subtitle */}
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.60)',
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '18px',
                fontWeight: 400,
                letterSpacing: '2px',
                marginBottom: '10px',
                textTransform: 'lowercase',
              }}
            >
              Available Balance To Claim
            </p>

            {/* Balance Display */}
            <div className="flex items-center justify-center gap-4 my-8 mt-12">
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.80)',
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: '80px',
                  fontWeight: 300,
                }}
              >
                {isLoading ? '...' : formattedBalance || '00.00'}
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

            {/* Info Text - Optional date message */}
            <p
              style={{
                color: '#F9B064',
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '25px',
                fontWeight: 400,
                letterSpacing: '1px',
                marginTop: '28px',
                marginBottom: '40px',
                textTransform: 'lowercase',
              }}
            >
              The Claim Will Be Available On Oct X 2025 00:00 UTC
            </p>

            {/* Claim Button */}
            <div className="flex justify-center mt-26">
              <button
                onClick={handleClaim}
                disabled={!address || !hasBalance || isPending || isConfirming}
                className="rounded-xl transition-all disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  color: '#F9B064',
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: '20px',
                  fontWeight: 400,
                  border: '2px solid #F9B064',
                  backgroundColor: 'transparent',
                  width: '180px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Claim'}
              </button>
            </div>

            {/* Status Messages */}
            {isSuccess && (
              <p
                style={{
                  color: '#10b981',
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '14px',
                  fontStyle: 'italic',
                  marginTop: '16px',
                }}
              >
                Successfully claimed your $MZCAL tokens!
              </p>
            )}

            {error && (
              <p
                style={{
                  color: '#ef4444',
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '14px',
                  marginTop: '16px',
                }}
              >
                Error: {error.message || 'Transaction failed'}
              </p>
            )}

            {!address && (
              <p
                style={{
                  color: '#F9B064',
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '14px',
                  fontStyle: 'italic',
                  marginTop: '16px',
                }}
              >
                Please connect your wallet to claim
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
