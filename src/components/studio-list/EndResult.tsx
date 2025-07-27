import React from 'react'

function EndResult() {
    return (
        <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">That's all the studios!</h3>
            <p className="text-lg text-gray-600 mb-2">You've seen everything we have to offer.</p>
            <p className="text-gray-500">Ready to book your perfect creative space?</p>
        </div>
    )
}

export default EndResult