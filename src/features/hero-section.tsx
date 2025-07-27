'use client';
import React from 'react';

interface HeroSectionProps {
    studios: any[];
    searchRef: React.RefObject<HTMLDivElement>;
    searchQuery: string;
    handleSearchChange: (value: string) => void;
    clearSearch: () => void;
    showSuggestions: boolean;
    suggestions: string[];
    handleSuggestionClick: (suggestion: string) => void;
}

function HeroSection({
    studios,
    searchRef,
    searchQuery,
    handleSearchChange,
    clearSearch,
    showSuggestions,
    suggestions,
    handleSuggestionClick
}: HeroSectionProps) {
    return (
        <div className="text-center mb-16">

            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl mb-8 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                </svg>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Find Your Perfect <br />
                <span className="text-orange-600">Creative Space</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
                Discover and book amazing studios for your creative projects. From cozy photography spaces to professional recording studios,
                find the perfect place to bring your ideas to life.
            </p>

            {/* ✅ Search Bar */}
            <div className="max-w-2xl mx-auto mb-16" ref={searchRef}>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search by city, area, or location..."
                        aria-label="Search studios by city, area, or location"
                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 shadow-sm pr-20"
                    />

                    {/* Clear Button */}
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            aria-label="Clear search"
                            className="absolute right-3 top-3 bg-gray-200 text-gray-600 px-3 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                        >
                            Clear
                        </button>
                    )}

                    {/* ✅ Auto-complete Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute top-full left-0 right-0 bg-white border border-orange-200 rounded-xl mt-2 shadow-lg z-50 max-h-60 overflow-y-auto">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="px-6 py-3 hover:bg-orange-50 transition-colors duration-200 flex items-center cursor-pointer"
                                >
                                    <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-gray-700">{suggestion}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* ✅ Search Results Info */}
                {searchQuery && (
                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            {studios.length === 0 ? (
                                <span>
                                    No studios found for "<span className="font-semibold">{searchQuery}</span>"
                                </span>
                            ) : (
                                <span>
                                    Found <span className="font-semibold text-orange-600">{studios.length}</span>{' '}
                                    studio{studios.length !== 1 ? 's' : ''} for "<span className="font-semibold">{searchQuery}</span>"
                                </span>
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HeroSection;
