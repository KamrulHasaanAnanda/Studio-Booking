'use client';
import React, { useState } from 'react';
import { getDistance } from '@/shared/utils/helpers';
import { Studio } from '@/types/studio';
import Link from 'next/link';

interface HeroSectionProps {
    studios: Studio[];
    searchRef: React.RefObject<HTMLDivElement>;
    searchQuery: string;
    handleSearchChange: (value: string) => void;
    clearSearch: () => void;
    showSuggestions: boolean;
    suggestions: string[];
    handleSuggestionClick: (suggestion: string) => void;
    allStudios: Studio[];
    setStudios: (studios: Studio[]) => void;
    setHasMore: (hasMore: boolean) => void;
}

function HeroSection({
    studios,
    searchRef,
    searchQuery,
    handleSearchChange,
    clearSearch,
    showSuggestions,
    suggestions,
    handleSuggestionClick,
    allStudios,
    setStudios,
    setHasMore
}: HeroSectionProps) {

    const [radius, setRadius] = useState<number>(10);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isSearchingByRadius, setIsSearchingByRadius] = useState<boolean>(false);

    const handleSearchByRadius = () => {
        if (!navigator.geolocation) {
            setErrorMessage('Geolocation is not supported by your browser');
            return;
        }

        setIsSearchingByRadius(true);
        setErrorMessage('');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                filterStudiosByRadius(latitude, longitude, radius);
                setIsSearchingByRadius(false);
            },
            (error) => {
                setIsSearchingByRadius(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setErrorMessage('Location access denied. Please enable location services to search by radius.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setErrorMessage('Location information is unavailable. Please try again.');
                        break;
                    case error.TIMEOUT:
                        setErrorMessage('Location request timed out. Please try again.');
                        break;
                    default:
                        setErrorMessage('An error occurred while getting your location. Please try again.');
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    };

    const filterStudiosByRadius = (userLat: number, userLon: number, radius: number) => {
        const filtered = allStudios.filter((studio: Studio) => {
            const studioLat = studio.Location.Coordinates.Latitude;
            const studioLon = studio.Location.Coordinates.Longitude;
            const distance = getDistance(userLat, userLon, studioLat, studioLon);
            return distance <= radius;
        });

        setStudios(filtered);
        setHasMore(false);

        if (filtered.length === 0) {
            setErrorMessage(`No studios found within ${radius} km of your location`);
        } else {
            setErrorMessage('');
        }
    };

    const handleRadiusChange = (newRadius: number) => {
        setRadius(newRadius);
        setErrorMessage('');
    };

    const clearRadiusSearch = () => {
        setStudios(allStudios);
        setHasMore(true);
        setErrorMessage('');
        setIsSearchingByRadius(false);
    };

    return (
        <div className="text-center mb-16">

            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-3xl mb-8 shadow-2xl shadow-orange-500/25 transform hover:scale-105 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                </svg>
            </div>


            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
                Find Your Perfect <br />
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Creative Space</span>
            </h1>
            <p className="text-sm sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
                Discover and book amazing studios for your creative projects. From cozy photography spaces to professional recording studios,
                find the perfect place to bring your ideas to life.
            </p>


            <div className="max-w-3xl mx-auto mb-12" ref={searchRef}>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search by city, area, or location..."
                        aria-label="Search studios by city, area, or location"
                        className="w-full bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl pl-10 pr-10 sm:pl-16 sm:pr-20 py-3 sm:py-5 text-sm sm:text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                    />

                    {/* Clear Button */}
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            aria-label="Clear search"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-600 px-4 py-2 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200 hover:scale-105"
                        >
                            Clear
                        </button>
                    )}

                    {/* ✅ Auto-complete Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border border-orange-200 rounded-2xl mt-3 shadow-2xl z-50 max-h-60 overflow-y-auto">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="px-6 py-4 hover:bg-orange-50 transition-all duration-200 flex items-center cursor-pointer first:rounded-t-2xl last:rounded-b-2xl"
                                >
                                    <svg className="w-5 h-5 text-gray-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-gray-700 font-medium">{suggestion}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* ✅ Search Results Info */}
                {searchQuery && (
                    <div className="mt-6 text-center">
                        <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-600 font-medium">
                                {studios.length === 0 ? (
                                    <span>
                                        No studios found for &quot;<span className="font-semibold text-gray-800">{searchQuery}</span>&quot;
                                    </span>
                                ) : (
                                    <span>
                                        Found <span className="font-bold text-orange-600 text-lg">{studios.length}</span>{' '}
                                        studio{studios.length !== 1 ? 's' : ''} for &quot;<span className="font-semibold text-gray-800">{searchQuery}</span>&quot;
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                )}
            </div>




            <div className="max-w-lg mx-auto mb-8">
                <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-8 shadow-xl border border-orange-200/50 backdrop-blur-sm">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl mb-4 shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Search by Location</h3>
                        <p className="text-gray-600 text-sm">Find studios near your current location</p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                            Select Search Radius
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {[5, 10, 20, 50].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => handleRadiusChange(r)}
                                    className={`relative px-2 sm:px-4 py-2 sm:py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${radius === r
                                        ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                                        : 'bg-white text-gray-700 hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300'
                                        }`}
                                >
                                    <span className="block text-lg font-bold">{r}</span>
                                    <span className="text-xs opacity-80">km</span>
                                    {radius === r && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleSearchByRadius}
                            disabled={isSearchingByRadius}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                        >
                            <>
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Search within {radius} km</span>
                            </>

                        </button>

                        {studios.length !== allStudios.length && (
                            <button
                                onClick={clearRadiusSearch}
                                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Show All Studios
                            </button>
                        )}
                    </div>


                    {errorMessage && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}



                </div>
            </div>
        </div>
    );
}

export default HeroSection;
