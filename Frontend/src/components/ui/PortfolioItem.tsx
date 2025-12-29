import React from 'react';

interface PortfolioItemProps {
    name: string;
    image: string;
    quantity?: number;
    className?: string;
}

export const PortfolioItem: React.FC<PortfolioItemProps> = ({ name, image, quantity, className = '' }) => {
    return (
        <div
            className={`flex items-center gap-4 p-4 rounded-xl relative z-30 ${className}`}
            style={{
                background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)',
                border: '3px solid transparent',
                backgroundClip: 'padding-box',
                position: 'relative'
            }}
        >
            {/* Gradient border effect */}
            <div
                className="absolute inset-0 rounded-xl -z-10"
                style={{
                    background: 'linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)',
                    padding: '3px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude'
                }}
            ></div>

            <img src={image} alt={name} className="w-16 h-16 object-cover rounded-lg" />

            <div className="flex-1">
                <h4
                    className="text-white font-bold"
                    style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                    {name}
                </h4>
                {quantity !== undefined && (
                    <p className="text-white/40 text-sm italic">Quantity: {quantity}</p>
                )}
            </div>
        </div>
    );
};
