import React from 'react';

interface AspectRatioProps {
    children: React.ReactNode;
    ratio?: number;
    className?: string;
}

export const AspectRatio: React.FC<AspectRatioProps> = ({ children, ratio = 1, className = '' }) => {
    return (
        <div
            className={`relative w-full overflow-hidden rounded-2xl bg-black/20 ${className}`}
            style={{ paddingBottom: `${(1 / ratio) * 100}%` }}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};
