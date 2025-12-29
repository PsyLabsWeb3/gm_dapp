import React, { useState } from 'react';
import { Heading } from '../components/ui/Heading';
import { ListingForm } from '../components/ui/ListingForm';
import { AssetSelector } from '../components/ui/AssetSelector';

const mockUserAssets = [
    { id: '1', name: 'Stream Pass', image: 'https://placehold.co/400' },
    { id: '2', name: 'Golden Skin', image: 'https://placehold.co/400' },
    { id: '3', name: 'Founder Badge', image: 'https://placehold.co/400' },
];

export const CreateListing: React.FC = () => {
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

    const handleSubmit = (data: any) => {
        console.log('Creating listing for asset:', selectedAssetId, data);
    };

    return (
        <main className="w-full max-w-7xl mx-auto px-8 py-12 relative z-20">
            <header className="mb-16 text-center">
                <Heading level={1} className="mb-4">Create Listing</Heading>
                <p className="uppercase tracking-[0.2em] text-white/40 font-bold text-sm" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                    Sell your assets
                </p>
            </header>

            <div className="space-y-12">
                <section>
                    <label className="block text-white/60 font-bold mb-6 uppercase tracking-widest text-xs text-center">
                        Step 1: Select an Asset
                    </label>
                    <AssetSelector
                        assets={mockUserAssets}
                        selectedId={selectedAssetId}
                        onSelect={setSelectedAssetId}
                    />
                </section>

                {selectedAssetId && (
                    <section>
                        <label className="block text-white/60 font-bold mb-6 uppercase tracking-widest text-xs text-center">
                            Step 2: Listing Details
                        </label>
                        <ListingForm onSubmit={handleSubmit} />
                    </section>
                )}
            </div>
        </main>
    );
};
