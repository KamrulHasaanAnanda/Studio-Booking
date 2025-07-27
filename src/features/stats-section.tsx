import React, { memo } from 'react'

function StatsSection({ studios }: { studios: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="text-3xl font-bold text-orange-600 mb-2">{studios}+</div>
                <div className="text-gray-700 font-medium">Amazing Studios</div>
                <div className="text-gray-500 text-sm mt-1">Handpicked for quality</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="text-3xl font-bold text-green-600 mb-2">4.8★</div>
                <div className="text-gray-700 font-medium">Average Rating</div>
                <div className="text-gray-500 text-sm mt-1">From real users</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="text-3xl font-bold text-blue-600 mb-2">৳2,200</div>
                <div className="text-gray-700 font-medium">Avg. Price/Hour</div>
                <div className="text-gray-500 text-sm mt-1">Great value</div>
            </div>
        </div>
    )
}

export default memo(StatsSection)