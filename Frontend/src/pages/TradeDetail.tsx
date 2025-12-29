import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heading } from '../components/ui/Heading';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const TradeDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <main className="w-full max-w-4xl mx-auto px-8 py-12 relative z-20">
            <header className="mb-12">
                <button
                    onClick={() => navigate(-1)}
                    className="text-[#F9B064] text-sm font-bold uppercase tracking-widest mb-4 hover:underline"
                    style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                    &larr; Back to Hub
                </button>
                <Heading level={1}>Deal Details</Heading>
                <p className="text-white/40 italic">Transaction ID: {id || 'TR-7721'}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="space-y-6">
                    <Heading level={3}>The Asset</Heading>
                    <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden">
                        <img src="https://placehold.co/600" alt="Asset" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex justify-between items-center">
                        <h4 className="text-xl font-bold text-white">Cyber Katana</h4>
                        <Badge variant="price">2.5 $MZCAL</Badge>
                    </div>
                </Card>

                <div className="space-y-8">
                    <Card className="space-y-4">
                        <Heading level={3}>Status</Heading>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                            <p className="text-white font-bold uppercase tracking-widest text-sm">Pending Approval</p>
                        </div>
                        <p className="text-white/40 text-sm italic">
                            This deal expires in 2 days.
                        </p>
                    </Card>

                    <Card className="space-y-6">
                        <Heading level={3}>Actions</Heading>
                        <div className="flex flex-col gap-4">
                            <Button variant="primary" className="w-full">ACCEPT DEAL</Button>
                            <Button variant="reject" className="w-full">REJECT OFFER</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
};
