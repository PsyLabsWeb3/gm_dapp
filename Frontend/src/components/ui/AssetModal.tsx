import React from 'react';
import { Heading } from './Heading';
import { Button } from './Button';

interface AssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    asset: {
        name: string;
        image: string;
        description?: string;
        price: string;
        symbol: string;
    } | null;
}

export const AssetModal: React.FC<AssetModalProps> = ({ isOpen, onClose, asset }) => {
    if (!isOpen || !asset) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div
                className="rounded-3xl relative z-30 max-w-2xl w-full"
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

                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <Heading level={2}>{asset.name}</Heading>
                        <button
                            onClick={onClose}
                            className="text-white/40 hover:text-white transition-colors text-2xl"
                        >
                            &times;
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="rounded-2xl overflow-hidden border border-white/10">
                            <img src={asset.image} alt={asset.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex flex-col gap-6">
                            <div>
                                <p className="text-white/40 uppercase tracking-widest text-xs font-bold mb-2">Description</p>
                                <p className="text-white/80 leading-relaxed italic">
                                    {asset.description || "This is a rare digital asset from the PsyLabs ecosystem. Enhance your experience with this unique item."}
                                </p>
                            </div>

                            <div>
                                <p className="text-white/40 uppercase tracking-widest text-xs font-bold mb-2">Price</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-[#F9B064]">{asset.price}</span>
                                    <span className="text-xl font-bold text-[#F9B064]/60">{asset.symbol}</span>
                                </div>
                            </div>

                            <Button variant="primary" className="w-full mt-auto">
                                BUY NOW
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
