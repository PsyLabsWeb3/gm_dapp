import React from 'react';
import { Button } from './Button';

interface ListingFormProps {
    onSubmit: (data: any) => void;
    className?: string;
}

export const ListingForm: React.FC<ListingFormProps> = ({ onSubmit, className = '' }) => {
    return (
        <div
            className={`max-w-2xl mx-auto rounded-3xl relative z-30 p-8 ${className}`}
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

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit({}); }}>
                <div>
                    <label className="block text-white/60 font-bold mb-2 uppercase tracking-widest text-xs">
                        Price in $MZCAL
                    </label>
                    <input
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F9B064] transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-white/60 font-bold mb-2 uppercase tracking-widest text-xs">
                        Quantity
                    </label>
                    <input
                        type="number"
                        placeholder="1"
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F9B064] transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-white/60 font-bold mb-2 uppercase tracking-widest text-xs">
                        Listing Duration (Days)
                    </label>
                    <select className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F9B064] transition-colors">
                        <option>1 Day</option>
                        <option>3 Days</option>
                        <option>7 Days</option>
                        <option>30 Days</option>
                    </select>
                </div>

                <Button variant="primary" type="submit" className="w-full mt-8">
                    CREATE LISTING
                </Button>
            </form>
        </div>
    );
};
