import React from 'react';
import { AspectRatio } from './AspectRatio';

interface Asset {
    id: string;
    name: string;
    image: string;
}

interface AssetSelectorProps {
    assets: Asset[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export const AssetSelector: React.FC<AssetSelectorProps> = ({ assets, selectedId, onSelect }) => {
    return (
        <div
            className="rounded-3xl relative z-30 p-6"
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {assets.map((asset) => (
                    <div
                        key={asset.id}
                        onClick={() => onSelect(asset.id)}
                        className={`cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden border-2 ${selectedId === asset.id ? 'border-[#F9B064] scale-95 shadow-[0_0_15px_rgba(249,176,100,0.5)]' : 'border-transparent hover:border-white/20'
                            }`}
                    >
                        <AspectRatio ratio={1}>
                            <img src={asset.image} alt={asset.name} className="w-full h-full object-cover" />
                        </AspectRatio>
                        <div className="p-2 text-center bg-black/40">
                            <p className="text-[10px] font-bold text-white/80 truncate uppercase tracking-tighter">
                                {asset.name}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
