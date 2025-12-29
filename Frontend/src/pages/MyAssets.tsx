import React from 'react';
import { Heading } from '../components/ui/Heading';
import { MarketplaceNav } from '../components/ui/MarketplaceNav';
import { PortfolioItem } from '../components/ui/PortfolioItem';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

const mockUserAssets = [
    { id: '1', name: 'Stream Pass', image: 'https://placehold.co/400', quantity: 1 },
    { id: '2', name: 'Golden Skin', image: 'https://placehold.co/400', quantity: 1 },
    { id: '3', name: 'Founder Badge', image: 'https://placehold.co/400', quantity: 1 },
];

export const MyAssets: React.FC = () => {
    return (
        <main className="w-full max-w-7xl mx-auto px-8 py-12 relative z-20">
            <header className="mb-16 text-center">
                <Heading level={1} className="mb-4">My Assets</Heading>
                <p className="uppercase tracking-[0.2em] text-white/40 font-bold text-sm" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                    Manage your collection
                </p>
            </header>

            <MarketplaceNav />

            <div className="flex justify-end mb-8">
                <Link to="/marketplace/create-listing">
                    <Button variant="primary">List New Asset</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockUserAssets.map((asset) => (
                    <PortfolioItem
                        key={asset.id}
                        name={asset.name}
                        image={asset.image}
                        quantity={asset.quantity}
                    />
                ))}
            </div>
        </main>
    );
};
