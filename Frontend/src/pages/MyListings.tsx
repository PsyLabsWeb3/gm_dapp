import React from 'react';
import { Heading } from '../components/ui/Heading';
import { MarketplaceNav } from '../components/ui/MarketplaceNav';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AspectRatio } from '../components/ui/AspectRatio';

const mockUserListings = [
    { id: '1', name: 'Cyber Katana', image: 'https://placehold.co/400', price: '2.5', symbol: '$MZCAL' },
];

export const MyListings: React.FC = () => {
    return (
        <main className="w-full max-w-7xl mx-auto px-8 py-12 relative z-20">
            <header className="mb-16 text-center">
                <Heading level={1} className="mb-4">My Listings</Heading>
                <p className="uppercase tracking-[0.2em] text-white/40 font-bold text-sm" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                    Manage your active sales
                </p>
            </header>

            <MarketplaceNav />

            {mockUserListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {mockUserListings.map((listing) => (
                        <Card key={listing.id} className="flex flex-col gap-6">
                            <AspectRatio ratio={1}>
                                <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />
                            </AspectRatio>

                            <div className="flex justify-between items-center px-2">
                                <Heading level={3}>{listing.name}</Heading>
                                <Badge variant="price">{listing.price} {listing.symbol}</Badge>
                            </div>

                            <div className="px-2 mt-auto">
                                <Button variant="reject" className="w-full">CANCEL LISTING</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
                    <p className="text-white/20 italic">You don't have any active listings</p>
                </div>
            )}
        </main>
    );
};
