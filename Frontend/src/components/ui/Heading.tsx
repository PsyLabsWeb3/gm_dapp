import React from 'react';

interface HeadingProps {
    children: React.ReactNode;
    level?: 1 | 2 | 3 | 4;
    className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ children, level = 1, className = '' }) => {
    const styles = {
        1: "text-4xl md:text-6xl font-bold text-[#F9B064]",
        2: "text-3xl md:text-4xl font-bold text-[#F9B064]",
        3: "text-xl md:text-2xl font-bold text-white/80",
        4: "text-lg font-bold text-white/60"
    };

    const commonStyle = {
        fontFamily: "'Cinzel Decorative', serif",
        textTransform: 'lowercase' as const
    };

    if (level === 1) return <h1 className={`${styles[1]} ${className}`} style={commonStyle}>{children}</h1>;
    if (level === 2) return <h2 className={`${styles[2]} ${className}`} style={commonStyle}>{children}</h2>;
    if (level === 3) return <h3 className={`${styles[3]} ${className}`} style={commonStyle}>{children}</h3>;
    return <h4 className={`${styles[4]} ${className}`} style={commonStyle}>{children}</h4>;
};
