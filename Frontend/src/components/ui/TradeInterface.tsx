import React, { useState } from 'react';
import { Button } from './Button';
import { Heading } from './Heading';

interface TradeInterfaceProps {
    className?: string;
    initialMode?: 'buy' | 'sell';
}

export const TradeInterface: React.FC<TradeInterfaceProps> = ({ className = '', initialMode = 'sell' }) => {
    const [mode, setMode] = useState<'buy' | 'sell'>(initialMode);

    return (
        <div
            className={`rounded-3xl relative z-30 p-8 ${className}`}
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

            <div className="flex justify-center gap-4 mb-10">
                <button
                    onClick={() => setMode('sell')}
                    className={`px-8 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${mode === 'sell' ? 'bg-[#F9B064] text-black' : 'bg-white/5 text-white/40 border border-white/10'
                        }`}
                    style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                    Sell Listing
                </button>
                <button
                    onClick={() => setMode('buy')}
                    className={`px-8 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${mode === 'buy' ? 'bg-[#F9B064] text-black' : 'bg-white/5 text-white/40 border border-white/10'
                        }`}
                    style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                    Buy Offer
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Primary Action Section */}
                <div className="space-y-6">
                    <Heading level={3}>{mode === 'sell' ? 'Asset to Sell' : 'Asset to Buy'}</Heading>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[200px] flex items-center justify-center border-dashed">
                        <p className="text-white/20 italic">Select asset from your portfolio</p>
                    </div>
                </div>

                {/* Terms Section */}
                <div className="space-y-6">
                    <Heading level={3}>Price Terms</Heading>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2">
                                {mode === 'sell' ? 'Asking Price ($MZCAL)' : 'Offer Amount ($MZCAL)'}
                            </label>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#F9B064] outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2">
                                Expiration
                            </label>
                            <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#F9B064] outline-none transition-all">
                                <option>1 Day</option>
                                <option>3 Days</option>
                                <option>7 Days</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-12 gap-4">
                <Button variant="primary" className="px-12">
                    {mode === 'sell' ? 'POST LISTING' : 'MAKE OFFER'}
                </Button>
                <Button variant="reject" className="px-12">CANCEL</Button>
            </div>
        </div>
    );
};
