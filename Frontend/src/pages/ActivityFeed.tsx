import React from 'react';
import { Heading } from '../components/ui/Heading';
import { MarketplaceNav } from '../components/ui/MarketplaceNav';
import { ActivityList } from '../components/ui/ActivityList';

const mockActivity: any[] = [
    { id: '1', type: 'sale', description: 'User 0x123...abc purchased "Golden Skin" for 1.2 $MZCAL', timestamp: '2 minutes ago' },
    { id: '2', type: 'listing', description: 'User 0x456...def listed "Cyber Katana" for 2.5 $MZCAL', timestamp: '15 minutes ago' },
    { id: '3', type: 'trade', description: 'Trade completed between 0x789...ghi and 0xabc...123', timestamp: '1 hour ago' },
    { id: '4', type: 'sale', description: 'User 0xdef...456 purchased "Stream Pass" for 0.05 $MZCAL', timestamp: '3 hours ago' },
];

export const ActivityFeed: React.FC = () => {
    return (
        <main className="w-full max-w-7xl mx-auto px-8 py-12 relative z-20">
            <header className="mb-16 text-center">
                <Heading level={1} className="mb-4">Activity Feed</Heading>
                <p className="uppercase tracking-[0.2em] text-white/40 font-bold text-sm" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                    Recent marketplace events
                </p>
            </header>

            <MarketplaceNav />

            <div className="max-w-3xl mx-auto">
                <ActivityList items={mockActivity} />
            </div>
        </main>
    );
};
