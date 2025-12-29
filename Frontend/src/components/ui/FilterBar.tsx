import React from 'react';

interface FilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    category: string;
    onCategoryChange: (category: string) => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    searchQuery,
    onSearchChange,
    category,
    onCategoryChange,
    sortBy,
    onSortChange
}) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search assets..."
                className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#333] text-white w-full md:w-64 focus:outline-none focus:border-[#F9B064] transition-colors"
            />

            <div className="flex gap-4 w-full md:w-auto">
                <select
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#333] text-white flex-1 md:flex-none focus:outline-none focus:border-[#F9B064] transition-colors"
                >
                    <option value="all">All Categories</option>
                    <option value="passes">Passes</option>
                    <option value="skins">Skins</option>
                    <option value="badges">Badges</option>
                    <option value="weapons">Weapons</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#333] text-white flex-1 md:flex-none focus:outline-none focus:border-[#F9B064] transition-colors"
                >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                </select>
            </div>
        </div>
    );
};
