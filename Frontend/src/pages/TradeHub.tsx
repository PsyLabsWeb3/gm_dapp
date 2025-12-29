import React, { useState } from 'react';
import { Heading } from '../components/ui/Heading';
import { MarketplaceNav } from '../components/ui/MarketplaceNav';
import { TradeInterface } from '../components/ui/TradeInterface';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const TradeHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'create' | 'offers' | 'listings'>('create');

    return (
        <main className="w-full max-w-7xl mx-auto px-8 py-12 relative z-20">
            <header className="mb-16 text-center">
                <Heading level={1} className="mb-4">Trade Hub</Heading>
                <p className="uppercase tracking-[0.2em] text-white/40 font-bold text-sm" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                    Manage your marketplace deals
                </p>
            </header>

            <MarketplaceNav />

            <div className="flex justify-center gap-8 mb-12 border-b border-white/5 pb-4">
                {['create', 'offers', 'listings'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`text-sm font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'text-[#F9B064]' : 'text-white/20 hover:text-white/40'
                            }`}
                        style={{ fontFamily: "'Cinzel Decorative', serif" }}
                    >
                        {tab === 'create' ? 'New Deal' : tab === 'offers' ? 'Buy Offers' : 'My Listings'}
                    </button>
                ))}
            </div>

            <div className="space-y-12">
                {activeTab === 'create' && (
                    <section>
                        <TradeInterface />
                    </section>
                )}

                {activeTab === 'offers' && (
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/5 rounded-lg"></div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold">Offer for Cyber Katana</h4>
                                <p className="text-white/40 text-xs italic">From: 0x123...abc</p>
                            </div>
                            <Badge variant="price">2.2 $MZCAL</Badge>
                        </Card>
                        <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <p className="text-white/20 italic">No other active offers</p>
                        </div>
                    </section>
                )}

                {activeTab === 'listings' && (
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <p className="text-white/20 italic">You have no active sell listings in the trade hub</p>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
};
