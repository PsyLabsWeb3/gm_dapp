import React from 'react';
import { NavLink } from 'react-router-dom';

export const MarketplaceNav: React.FC = () => {
    const links = [
        { to: '/marketplace', label: 'Browse', end: true },
        { to: '/marketplace/my-assets', label: 'My Assets' },
        { to: '/marketplace/my-listings', label: 'My Listings' },
        { to: '/marketplace/trade', label: 'Trade Hub' },
        { to: '/marketplace/activity', label: 'Activity' },
    ];

    return (
        <nav className="flex flex-wrap justify-center gap-4 mb-12">
            {links.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                        `px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 border ${isActive
                            ? 'bg-[#F9B064] text-black border-[#F9B064] shadow-[0_0_15px_rgba(249,176,100,0.3)]'
                            : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
                        }`
                    }
                    style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                    {link.label}
                </NavLink>
            ))}
        </nav>
    );
};
