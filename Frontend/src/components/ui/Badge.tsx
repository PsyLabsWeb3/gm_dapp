import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'price' | 'default';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: "bg-white/10 text-white/80",
        price: "rounded-full px-3 py-1 text-sm border border-[#F9B064] text-[#F9B064]"
    };

    const style = variant === 'price' ? {
        background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)'
    } : {};

    return (
        <span
            className={`inline-block font-bold uppercase tracking-wider ${variants[variant]} ${className}`}
            style={style}
        >
            {children}
        </span>
    );
};
