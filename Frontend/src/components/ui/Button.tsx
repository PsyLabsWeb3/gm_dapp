import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'reject';
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseStyles = "rounded-xl transition-all flex items-center justify-center font-medium";

    const variants = {
        primary: "text-white",
        secondary: "text-[#F9B064] border-2 border-[#F9B064] bg-transparent",
        outline: "text-[#F9B064] border-2 border-[#F9B064] bg-transparent",
        reject: "text-white"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    const primaryStyle = variant === 'primary' ? {
        backgroundImage: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%), linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        border: '4px solid transparent',
        fontFamily: 'Lato, sans-serif',
        fontStyle: 'italic',
        fontSize: '18px',
        color: '#FFFFFF'
    } : variant === 'reject' ? {
        backgroundImage: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%), linear-gradient(180deg, #FF6B6B 0%, rgba(255, 107, 107, 0.27) 100%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        border: '4px solid transparent',
        fontFamily: 'Lato, sans-serif',
        fontStyle: 'italic',
        fontSize: '18px',
        color: '#FFFFFF'
    } : {};

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            style={primaryStyle}
            {...props}
        >
            {children}
        </button>
    );
};
