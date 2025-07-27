import React from 'react'

function GetDataLoader() {
    return (
        <div className="flex justify-center items-center py-12">
            <div className="flex space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
        </div>
    )
}

export default GetDataLoader