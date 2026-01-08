/**
 * QuantitySelector - Premium quantity selection with quick-select buttons
 */

interface QuantitySelectorProps {
    quantity: number
    setQuantity: (qty: number) => void
    maxQuantity?: number
}

export function QuantitySelector({ quantity, setQuantity, maxQuantity = 10 }: QuantitySelectorProps) {
    const quickSelectOptions = [1, 3, 5]

    const handleIncrement = () => setQuantity(Math.min(quantity + 1, maxQuantity))
    const handleDecrement = () => setQuantity(Math.max(quantity - 1, 1))
    const handleMax = () => setQuantity(maxQuantity)

    return (
        <div className="w-full space-y-4">
            {/* Quick Select Buttons */}
            <div className="flex items-center justify-center gap-3">
                {quickSelectOptions.map((num) => (
                    <button
                        key={num}
                        onClick={() => setQuantity(num)}
                        className="w-12 h-12 rounded-lg transition-all duration-200 cursor-pointer"
                        style={{
                            background: quantity === num
                                ? 'linear-gradient(180deg, #F9B064 0%, #93683B 100%)'
                                : 'rgba(249, 176, 100, 0.1)',
                            border: quantity === num
                                ? 'none'
                                : '1px solid rgba(249, 176, 100, 0.3)',
                            color: quantity === num ? '#0C0C0C' : '#F9B064',
                            fontFamily: "'Cinzel Decorative', serif",
                            fontWeight: 700,
                            fontSize: '16px',
                        }}
                    >
                        {num}
                    </button>
                ))}
                <button
                    onClick={handleMax}
                    className="px-4 h-12 rounded-lg transition-all duration-200 cursor-pointer"
                    style={{
                        background: quantity === maxQuantity
                            ? 'linear-gradient(180deg, #F9B064 0%, #93683B 100%)'
                            : 'rgba(249, 176, 100, 0.1)',
                        border: quantity === maxQuantity
                            ? 'none'
                            : '1px solid rgba(249, 176, 100, 0.3)',
                        color: quantity === maxQuantity ? '#0C0C0C' : '#F9B064',
                        fontFamily: 'Lato, sans-serif',
                        fontWeight: 700,
                        fontSize: '14px',
                        letterSpacing: '1px',
                    }}
                >
                    MAX
                </button>
            </div>

            {/* Manual Selector */}
            <div
                className="flex items-center justify-center gap-4 py-3 px-6 rounded-xl mx-auto"
                style={{
                    background: 'rgba(26, 26, 26, 0.8)',
                    border: '1px solid rgba(249, 176, 100, 0.3)',
                    maxWidth: '200px',
                }}
            >
                <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-2xl transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-[#F9B064]/10"
                    style={{ color: '#F9B064' }}
                >
                    −
                </button>

                <span
                    className="w-12 text-center"
                    style={{
                        color: '#FFFFFF',
                        fontFamily: "'Cinzel Decorative', serif",
                        fontSize: '28px',
                        fontWeight: 700
                    }}
                >
                    {quantity}
                </span>

                <button
                    onClick={handleIncrement}
                    disabled={quantity >= maxQuantity}
                    className="w-10 h-10 flex items-center justify-center text-2xl transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-[#F9B064]/10"
                    style={{ color: '#F9B064' }}
                >
                    +
                </button>
            </div>
        </div>
    )
}
