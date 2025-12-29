import React, { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Heading } from '../components/ui/Heading';
import { AspectRatio } from '../components/ui/AspectRatio';
import { FilterBar } from '../components/ui/FilterBar';
import { AssetModal } from '../components/ui/AssetModal';
import { MarketplaceNav } from '../components/ui/MarketplaceNav';

interface Asset {
    id: string;
    category: string;
    asset: {
        name: string;
        image: string;
        description?: string;
    };
    currencyValuePerToken: {
        displayValue: string;
        symbol: string;
    };
}

const mockListings: Asset[] = [
    {
        "id": "1",
        "category": "passes",
        "asset": {
            "name": "Stream Pass",
            "image": "https://placehold.co/400",
            "description": "Unlock exclusive streaming features and high-quality bitrates with this premium pass."
        },
        "currencyValuePerToken": {
            "displayValue": "0.05",
            "symbol": "$MZCAL"
        }
    },
    {
        "id": "2",
        "category": "skins",
        "asset": {
            "name": "Golden Skin",
            "image": "https://placehold.co/400",
            "description": "A legendary golden skin for your avatar. Shine bright in the metaverse."
        },
        "currencyValuePerToken": {
            "displayValue": "1.2",
            "symbol": "$MZCAL"
        }
    },
    {
        "id": "3",
        "category": "badges",
        "asset": {
            "name": "Founder Badge",
            "image": "https://placehold.co/400",
            "description": "A limited edition badge for the early supporters of the PsyLabs ecosystem."
        },
        "currencyValuePerToken": {
            "displayValue": "0.5",
            "symbol": "$MZCAL"
        }
    },
    {
        "id": "4",
        "category": "weapons",
        "asset": {
            "name": "Cyber Katana",
            "image": "https://placehold.co/400",
            "description": "A high-frequency blade designed for digital combat. Sharp and lethal."
        },
        "currencyValuePerToken": {
            "displayValue": "2.5",
            "symbol": "$MZCAL"
        }
    },
    {
        "id": "5",
        "category": "skins",
        "asset": {
            "name": "Neon Aura",
            "image": "https://placehold.co/400",
            "description": "Surround yourself with a vibrant neon glow that pulses with the beat."
        },
        "currencyValuePerToken": {
            "displayValue": "0.15",
            "symbol": "$MZCAL"
        }
    },
    {
        "id": "6",
        "category": "passes",
        "asset": {
            "name": "Beta Access",
            "image": "https://placehold.co/400",
            "description": "Gain early access to upcoming features and experimental builds."
        },
        "currencyValuePerToken": {
            "displayValue": "0.01",
            "symbol": "$MZCAL"
        }
    }
];

export const Marketplace: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredListings = useMemo(() => {
        let result = [...mockListings];

        // Filter by search query
        if (searchQuery) {
            result = result.filter(item =>
                item.asset.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (category !== 'all') {
            result = result.filter(item => item.category === category);
        }

        // Sort
        if (sortBy === 'price-low') {
            result.sort((a, b) => parseFloat(a.currencyValuePerToken.displayValue) - parseFloat(b.currencyValuePerToken.displayValue));
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => parseFloat(b.currencyValuePerToken.displayValue) - parseFloat(a.currencyValuePerToken.displayValue));
        }

        return result;
    }, [searchQuery, category, sortBy]);

    const handleOpenModal = (asset: Asset) => {
        setSelectedAsset(asset);
        setIsModalOpen(true);
    };

    const handleBuy = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        console.log(`Triggering buy for listing ${id}`);
    };

    return (
        <main className="w-full max-w-7xl mx-auto px-8 py-12 relative z-20">
            <header className="mb-16 text-center">
                <Heading level={1} className="mb-4">Marketplace</Heading>
                <p
                    className="uppercase tracking-[0.2em] text-white/40 font-bold text-sm"
                    style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                    Explore assets
                </p>
            </header>

            <MarketplaceNav />

            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                category={category}
                onCategoryChange={setCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
                {filteredListings.map((listing) => (
                    <Card
                        key={listing.id}
                        className="flex flex-col gap-6 group cursor-pointer"
                        onClick={() => handleOpenModal(listing)}
                    >
                        <AspectRatio ratio={1} className="transition-transform duration-500 group-hover:scale-[1.02]">
                            <img
                                src={listing.asset.image}
                                alt={listing.asset.name}
                                className="w-full h-full object-cover"
                            />
                        </AspectRatio>

                        <div className="flex justify-between items-center px-2">
                            <Heading level={3}>{listing.asset.name}</Heading>
                            <Badge variant="price">
                                {listing.currencyValuePerToken.displayValue} {listing.currencyValuePerToken.symbol}
                            </Badge>
                        </div>

                        <div className="px-2 mt-auto">
                            <Button
                                variant="primary"
                                className="w-full py-4 text-lg"
                                onClick={(e) => handleBuy(e, listing.id)}
                            >
                                BUY NOW
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <AssetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                asset={selectedAsset ? {
                    name: selectedAsset.asset.name,
                    image: selectedAsset.asset.image,
                    description: selectedAsset.asset.description,
                    price: selectedAsset.currencyValuePerToken.displayValue,
                    symbol: selectedAsset.currencyValuePerToken.symbol
                } : null}
            />
        </main>
    );
};
