import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    return (
        <div
            className={`rounded-3xl relative z-30 p-6 transition-transform duration-500 group-hover:scale-[1.02] ${className}`}
            onClick={onClick}
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
            {children}
        </div>
    );
};
