/**
 * MzcalPage - Unified page for Eligibility, Buy, and Claim functionality
 * Preserves all original content and styling from individual pages
 */

import { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import { isAddress, parseEther } from 'viem'
import toast from 'react-hot-toast'
import { useWhitelistStatus } from '../hooks/useWhitelistStatus'
import { usePresaleTokenPrice } from '../hooks/useTokenPrices'
import { useBuyPresale, useClaimMZCAL } from '../hooks/useBuyTokens'
import { usePresaleTokenBalance } from '../hooks/useTokenBalance'
import badgetIcon from '../assets/badget.png'

type TabType = 'eligibility' | 'buy' | 'claim'

export function MzcalPage() {
    const [activeTab, setActiveTab] = useState<TabType>('eligibility')

    const tabs: { id: TabType; label: string }[] = [
        { id: 'eligibility', label: 'Eligibility' },
        { id: 'buy', label: 'Buy' },
        { id: 'claim', label: 'Claim' },
    ]

    return (
        <div className="h-full w-full flex flex-col items-center justify-center px-4 md:px-8 py-6">
            <div className="w-full flex flex-col gap-6" style={{ maxWidth: '1100px' }}>

                {/* Tab Navigation */}
                <div className="flex justify-center gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="px-6 py-3 rounded-xl transition-all cursor-pointer"
                            style={{
                                background: activeTab === tab.id
                                    ? 'linear-gradient(180deg, #F9B064 0%, #93683B 100%)'
                                    : 'rgba(249, 176, 100, 0.1)',
                                border: activeTab === tab.id
                                    ? 'none'
                                    : '1px solid rgba(249, 176, 100, 0.3)',
                                color: activeTab === tab.id ? '#0C0C0C' : '#F9B064',
                                fontFamily: "'Cinzel Decorative', serif",
                                fontSize: '18px',
                                fontWeight: 700,
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content - Fixed height container to prevent layout shift */}
                <div style={{ minHeight: '450px' }}>
                    {activeTab === 'eligibility' && <EligibilityTab />}
                    {activeTab === 'buy' && <BuyTab />}
                    {activeTab === 'claim' && <ClaimTab />}
                </div>
            </div>
        </div>
    )
}

/* ============ ELIGIBILITY TAB ============ */
function EligibilityTab() {
    const { address: connectedAddress } = useAccount()
    const [inputAddress, setInputAddress] = useState('')
    const [addressToCheck, setAddressToCheck] = useState<`0x${string}` | ''>('')
    const [error, setError] = useState('')

    const effectiveAddress = connectedAddress || inputAddress
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

    const handleReset = () => {
        setAddressToCheck('')
        setInputAddress('')
        setError('')
    }

    return (
        <div
            className="max-w-3xl w-full mx-auto rounded-3xl p-6 relative overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)',
                border: '3px solid transparent',
                backgroundClip: 'padding-box',
            }}
        >
            {/* Gradient border */}
            <div
                className="absolute inset-0 rounded-3xl -z-10"
                style={{
                    background: 'linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)',
                    padding: '3px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />

            <h2 className="text-3xl font-bold mb-12 text-center tracking-wider" style={{ color: '#F9B064' }}>
                <span style={{ fontFamily: "'Cinzel Decorative', serif", fontWeight: 700 }}>$MZCAL Presale whitelist</span>
            </h2>

            {/* Address Input Section */}
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
                                fontWeight: 700,
                                textTransform: 'lowercase',
                            }}
                        >
                            {connectedAddress ? 'Connected Address' : 'Enter Address'}
                        </label>

                        {connectedAddress ? (
                            <div
                                className="font-mono text-base text-[#d4af37] px-6 py-3 break-all border border-[#d4af37]/30"
                                style={{ backgroundColor: 'rgba(147, 104, 59, 0.15)', borderRadius: '20px' }}
                            >
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
                        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    </div>

                    <div className="flex justify-center mb-12">
                        <button
                            onClick={handleCheck}
                            className="rounded-xl transition-all cursor-pointer"
                            style={{
                                color: '#FFFFFF',
                                fontFamily: 'Lato, sans-serif',
                                fontStyle: 'italic',
                                fontSize: '27px',
                                border: '4px solid transparent',
                                backgroundImage: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%), linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)',
                                backgroundOrigin: 'border-box',
                                backgroundClip: 'padding-box, border-box',
                                width: '330px',
                                height: '70px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            Check Eligibility
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
                                <svg className="h-8 w-8 text-[#d4af37] animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            </div>
                            <p className="text-[#d4af37] font-medium text-center">Checking eligibility...</p>
                            <div className="mt-4 pt-4 border-t border-[#d4af37]/20">
                                <p className="text-xs text-[#d4af37]/60 text-center break-all font-mono">{addressToCheck}</p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {isError && (
                        <div className="bg-[#1a1a1a] border border-red-500/50 rounded-xl p-6">
                            <div className="flex items-center justify-center mb-3">
                                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-red-500 font-medium text-center mb-2">Error checking eligibility</p>
                            <p className="text-red-400/70 text-sm text-center">{contractError?.message || 'Unable to connect to contract'}</p>
                        </div>
                    )}

                    {/* Whitelisted */}
                    {!isLoading && !isError && isWhitelisted && (
                        <div className="text-center space-y-8">
                            <div className="flex justify-center mb-6">
                                <img src={badgetIcon} alt="Badge" className="w-24 h-24" />
                            </div>
                            <div className="space-y-4">
                                <p style={{ color: 'rgba(255, 255, 255, 0.80)', fontFamily: "'Cinzel Decorative', serif", fontSize: '28px', fontWeight: 700, textTransform: 'lowercase' }}>
                                    The spirits favor you.
                                </p>
                                <p style={{ color: '#F9B064', fontFamily: "'Cinzel Decorative', serif", fontSize: '28px', fontWeight: 700, textTransform: 'lowercase' }}>
                                    Your address is on the whitelist
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Not Whitelisted */}
                    {!isLoading && !isError && isWhitelisted === false && (
                        <div className="space-y-6">
                            <div>
                                <label className="block mb-3" style={{ color: 'rgba(255, 255, 255, 0.60)', fontFamily: "'Cinzel Decorative', serif", fontSize: '24px', fontWeight: 700, textTransform: 'lowercase' }}>
                                    enter address
                                </label>
                                <div className="w-full px-6 py-3 font-mono text-base break-all" style={{ backgroundColor: 'rgba(147, 104, 59, 0.15)', borderRadius: '20px', border: '1px solid rgba(212, 175, 55, 0.5)', color: '#d4af37' }}>
                                    {addressToCheck}
                                </div>
                            </div>
                            <p style={{ color: '#F9B064', fontFamily: 'Lato, sans-serif', fontSize: '22px', fontStyle: 'italic', lineHeight: '1.6' }}>
                                Unfortunately, this address is not eligible for the current whitelist. However, new portals will open soon... Stay tuned to our communication channels.
                            </p>
                        </div>
                    )}

                    {/* Check Another */}
                    <div className="flex justify-center mt-8">
                        <button onClick={handleReset} className="text-[#F9B064] underline text-sm cursor-pointer">
                            Check another address
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ============ BUY TAB ============ */
function BuyTab() {
    const { address } = useAccount()
    const [amount, setAmount] = useState('')
    const [purchasedAmount, setPurchasedAmount] = useState('')
    const noWalletToastShown = useRef(false)
    const notWhitelistedToastShown = useRef(false)
    const noWalletToastId = useRef<string | null>(null)

    const { data: isWhitelisted } = useWhitelistStatus(address)
    const { priceInWei, priceInEth } = usePresaleTokenPrice()
    const { buyPresale, isPending, isConfirming, isSuccess, error, hash } = useBuyPresale()

    // Toast effects
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!address && !noWalletToastShown.current) {
                const toastId = toast.error('The portal awaits: Connect your wallet to access the presale', { duration: 6000 })
                noWalletToastId.current = toastId
                noWalletToastShown.current = true
            }
        }, 100)
        if (address && noWalletToastId.current) {
            toast.dismiss(noWalletToastId.current)
            noWalletToastId.current = null
        }
        return () => clearTimeout(timer)
    }, [address])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (address && isWhitelisted === false && !notWhitelistedToastShown.current) {
                toast.error('The portal remains closed: Your address is not on the presale whitelist', { duration: 6000 })
                notWhitelistedToastShown.current = true
            }
        }, 100)
        if (!address) notWhitelistedToastShown.current = false
        return () => clearTimeout(timer)
    }, [address, isWhitelisted])

    const calculateMzcal = (ethAmount: string) => {
        const eth = parseFloat(ethAmount)
        const price = parseFloat(priceInEth)
        if (isNaN(eth) || eth <= 0 || price === 0) return '00.00'
        return (eth / price).toFixed(2)
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

    useEffect(() => {
        if (isSuccess && amount) setPurchasedAmount(calculateMzcal(amount))
    }, [isSuccess, amount])

    const handleBuyMore = () => {
        setAmount('')
        setPurchasedAmount('')
    }

    // Success State
    if (isSuccess && purchasedAmount) {
        return (
            <div className="mx-auto" style={{ maxWidth: '1000px' }}>
                <div
                    className="rounded-3xl p-6 relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)',
                        border: '3px solid transparent',
                        backgroundClip: 'padding-box',
                    }}
                >
                    <div className="absolute inset-0 rounded-3xl -z-10" style={{ background: 'linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)', padding: '3px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

                    <div className="text-center space-y-8">
                        <h1 style={{ color: '#F9B064', fontFamily: "'Cinzel Decorative', serif", fontSize: '50px', fontWeight: 700, marginBottom: '24px' }}>Congratulations!</h1>
                        <p style={{ color: 'rgba(255, 255, 255, 0.80)', fontFamily: "'Cinzel Decorative', serif", fontSize: '25px', lineHeight: '1.6' }}>
                            The portal has opened in your favor.<br />Your offering has been received.
                        </p>
                        <div className="flex items-center justify-center gap-4 my-8">
                            <span style={{ color: 'rgba(255, 255, 255, 0.80)', fontFamily: "'Cinzel Decorative', serif", fontSize: '80px', fontWeight: 300 }}>{purchasedAmount}</span>
                            <span style={{ color: '#F9B064', fontFamily: "'Cinzel Decorative', serif", fontSize: '80px', fontWeight: 700 }}>$MZCAL</span>
                        </div>
                        <p style={{ color: 'rgba(255, 255, 255, 0.60)', fontFamily: "'Cinzel Decorative', serif", fontSize: '25px' }}>Thank you for supporting Guerrero Maya presale</p>
                        <div className="flex justify-center gap-6 mt-8">
                            <button onClick={handleBuyMore} className="rounded-xl cursor-pointer" style={{ color: '#F9B064', fontFamily: 'Lato, sans-serif', fontStyle: 'italic', fontSize: '18px', border: '4px solid transparent', backgroundImage: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%), linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', width: '200px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Buy More</button>
                            {hash && (
                                <a href={`https://sepolia.arbiscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="rounded-xl" style={{ color: '#FFFFFF', fontFamily: 'Lato, sans-serif', fontStyle: 'italic', fontSize: '18px', border: '4px solid transparent', backgroundImage: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%), linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', width: '200px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>view transaction</a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Buy Form - Two Column Layout
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Card - Input */}
            <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)', border: '3px solid transparent', backgroundClip: 'padding-box' }}>
                <div className="absolute inset-0 rounded-3xl -z-10" style={{ background: 'linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)', padding: '3px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

                <h2 className="text-center mb-12" style={{ color: '#F9B064', fontFamily: "'Cinzel Decorative', serif", fontSize: '32px', fontWeight: 700, textTransform: 'uppercase' }}>$MZCAL Presale</h2>

                <div className="flex flex-col items-center space-y-8">
                    <div>
                        <label className="block mb-4 mt-8" style={{ color: 'rgba(255, 255, 255, 0.60)', fontFamily: "'Cinzel Decorative', serif", fontSize: '22px' }}>Amount of $ETH to spend</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter ETH amount"
                            className="w-full px-6 py-4 text-[#d4af37] placeholder-[#d4af37]/30 text-lg focus:outline-none transition-colors"
                            style={{ backgroundColor: 'rgba(147, 104, 59, 0.15)', borderRadius: '20px', border: '1px solid rgba(212, 175, 55, 0.5)', fontFamily: 'Lato, sans-serif' }}
                            disabled={!isWhitelisted || isPending || isConfirming}
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="w-full max-w-md">
                        <div className="text-center py-2" style={{ color: '#F9B064', fontFamily: "'Cinzel Decorative', serif", fontSize: '16px', fontWeight: 700, textTransform: 'lowercase' }}>
                            Current rate: 1 $MZCAL = {priceInEth} $ETH
                        </div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleBuy}
                            disabled={!isWhitelisted || !amount || isPending || isConfirming}
                            className="rounded-xl transition-all disabled:cursor-not-allowed cursor-pointer"
                            style={{ color: '#FFFFFF', fontFamily: 'Lato, sans-serif', fontStyle: 'italic', fontSize: '24px', border: '4px solid transparent', backgroundImage: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%), linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', width: '200px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Buy'}
                        </button>
                    </div>

                    {error && <p className="text-center" style={{ color: '#ef4444', fontFamily: 'Lato, sans-serif', fontSize: '14px' }}>Error: {error.message || 'Transaction failed'}</p>}
                    {!isWhitelisted && address && <p className="text-center" style={{ color: '#F9B064', fontFamily: 'Lato, sans-serif', fontSize: '14px', fontStyle: 'italic' }}>Your address is not whitelisted for presale</p>}
                </div>
            </div>

            {/* Right Card - You Will Receive */}
            <div className="rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center" style={{ background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)', border: '3px solid transparent', backgroundClip: 'padding-box' }}>
                <div className="absolute inset-0 rounded-3xl -z-10" style={{ background: 'linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)', padding: '3px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

                <h2 className="text-center mb-12" style={{ color: '#F9B064', fontFamily: "'Cinzel Decorative', serif", fontSize: '38px', fontWeight: 700, textTransform: 'uppercase' }}>You will receive</h2>
                <div className="text-center mb-12" style={{ color: 'rgba(255, 255, 255, 0.80)', fontFamily: "'Cinzel Decorative', serif", fontSize: '72px', fontWeight: 300 }}>{amount ? calculateMzcal(amount) : '00.00'}</div>
                <div style={{ color: '#F9B064', fontFamily: "'Cinzel Decorative', serif", fontSize: '80px', fontWeight: 700 }}>$MZCAL</div>
            </div>
        </div>
    )
}

/* ============ CLAIM TAB ============ */
function ClaimTab() {
    const { address } = useAccount()
    const { formattedBalance, isLoading } = usePresaleTokenBalance(address)
    const { claimMZCAL, isPending, isConfirming, isSuccess, error } = useClaimMZCAL()

    const handleClaim = () => {
        if (!address || !formattedBalance || parseFloat(formattedBalance) === 0) return
        claimMZCAL()
    }

    const hasBalance = formattedBalance && parseFloat(formattedBalance) > 0

    return (
        <div className="mx-auto" style={{ maxWidth: '1000px' }}>
            <div
                className="rounded-3xl p-6 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)',
                    border: '3px solid transparent',
                    backgroundClip: 'padding-box',
                }}
            >
                <div className="absolute inset-0 rounded-3xl -z-10" style={{ background: 'linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)', padding: '3px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

                <div className="text-center space-y-8">
                    <h1 style={{ color: '#F9B064', fontFamily: "'Cinzel Decorative', serif", fontSize: '50px', fontWeight: 700, marginBottom: '24px' }}>Claim Your $MZCAL</h1>

                    <p style={{ color: 'rgba(255, 255, 255, 0.60)', fontFamily: "'Cinzel Decorative', serif", fontSize: '18px', letterSpacing: '2px', textTransform: 'lowercase' }}>Available Balance To Claim</p>

                    <div className="flex items-center justify-center gap-4 my-8 mt-12">
                        <span style={{ color: 'rgba(255, 255, 255, 0.80)', fontFamily: "'Cinzel Decorative', serif", fontSize: '80px', fontWeight: 300 }}>{isLoading ? '...' : formattedBalance || '00.00'}</span>
                        <span style={{ color: '#F9B064', fontFamily: "'Cinzel Decorative', serif", fontSize: '80px', fontWeight: 700 }}>$MZCAL</span>
                    </div>

                    <p style={{ color: '#F9B064', fontFamily: "'Cinzel Decorative', serif", fontSize: '25px', letterSpacing: '1px', textTransform: 'lowercase' }}>The Claim Will Be Available On Oct X 2025 00:00 UTC</p>

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleClaim}
                            disabled={!address || !hasBalance || isPending || isConfirming}
                            className="rounded-xl transition-all disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                            style={{ color: '#F9B064', fontFamily: "'Cinzel Decorative', serif", fontSize: '20px', border: '2px solid #F9B064', backgroundColor: 'transparent', width: '180px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Claim'}
                        </button>
                    </div>

                    {isSuccess && <p style={{ color: '#10b981', fontFamily: 'Lato, sans-serif', fontSize: '14px', fontStyle: 'italic', marginTop: '16px' }}>Successfully claimed your $MZCAL tokens!</p>}
                    {error && <p style={{ color: '#ef4444', fontFamily: 'Lato, sans-serif', fontSize: '14px', marginTop: '16px' }}>Error: {error.message || 'Transaction failed'}</p>}
                    {!address && <p style={{ color: '#F9B064', fontFamily: 'Lato, sans-serif', fontSize: '14px', fontStyle: 'italic', marginTop: '16px' }}>Please connect your wallet to claim</p>}
                </div>
            </div>
        </div>
    )
}

export default MzcalPage
