import React from 'react';

interface ActivityItem {
    id: string;
    type: 'sale' | 'listing' | 'trade';
    description: string;
    timestamp: string;
}

interface ActivityListProps {
    items: ActivityItem[];
    className?: string;
}

export const ActivityList: React.FC<ActivityListProps> = ({ items, className = '' }) => {
    return (
        <div className={`space-y-4 ${className}`}>
            {items.map((item) => (
                <div
                    key={item.id}
                    className="rounded-3xl relative z-30 p-4 flex items-center gap-4"
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

                    <div className="w-12 h-12 rounded-full bg-[#F9B064]/20 flex items-center justify-center text-[#F9B064]">
                        {item.type === 'sale' ? '💰' : item.type === 'listing' ? '📝' : '🤝'}
                    </div>

                    <div className="flex-1">
                        <p className="text-white/80 font-medium">{item.description}</p>
                        <p className="text-white/40 text-xs uppercase tracking-widest mt-1">{item.timestamp}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
