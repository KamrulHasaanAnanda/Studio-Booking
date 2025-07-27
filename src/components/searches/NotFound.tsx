import React, { memo } from 'react'

function NotFound({ searchQuery, clearSearch }: { searchQuery: string, clearSearch: () => void }) {
    return (
        <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-300 rounded-2xl mb-6 shadow-lg">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No studios found</h3>
            <p className="text-lg text-gray-600 mb-2">We couldn't find any studios matching "<span className="font-semibold">{searchQuery}</span>"</p>
            <button
                onClick={clearSearch}
                className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors duration-200 shadow-md"
            >
                View All Studios
            </button>
        </div>
    )
}

export default memo(NotFound)