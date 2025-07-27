import Booking from '@/components/studio-list/Booking'
import React, { memo } from 'react'

function StudioCard({ studio }: { studio: any }) {
    return (
        <div
            key={studio.Id}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
        >

            <div className="relative h-56 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center transform group-hover:scale-105 transition-transform duration-300">
                        <div className="text-5xl mb-3">
                            {studio.Type === 'Photography' ? '📸' :
                                studio.Type === 'Recording Studio' ? '🎤' :
                                    studio.Type === 'Art Studio' ? '🎨' : '🎭'}
                        </div>
                        <p className="text-lg font-semibold">{studio.Type}</p>
                    </div>
                </div>
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white/95 rounded-xl px-3 py-1 shadow-md">
                    <span className="text-lg font-bold text-green-600">৳{studio.PricePerHour}</span>
                </div>
                {/* Rating Badge */}
                <div className="absolute top-4 left-4 bg-white/95 rounded-xl px-3 py-1 shadow-md">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">{studio.Rating}</span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Studio Name */}
                <div className="mb-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                        {studio.Name}
                    </h2>
                    <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${studio.Type === 'Photography' ? 'bg-blue-100 text-blue-700' :
                        studio.Type === 'Recording Studio' ? 'bg-purple-100 text-purple-700' :
                            studio.Type === 'Art Studio' ? 'bg-pink-100 text-pink-700' :
                                'bg-green-100 text-green-700'
                        }`}>
                        {studio.Type}
                    </span>
                </div>

                {/* Location */}
                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-800">{studio.Location.City}, {studio.Location.Area}</p>
                    <p className="text-xs text-gray-500">{studio.Location.Address}</p>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">What's included</h3>
                    <div className="flex flex-wrap gap-2">
                        {studio.Amenities.slice(0, 3).map((amenity: string, index: number) => (
                            <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
                                {amenity}
                            </span>
                        ))}
                        {studio.Amenities.length > 3 && (
                            <span className="inline-block bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium">
                                +{studio.Amenities.length - 3} more
                            </span>
                        )}
                    </div>
                </div>


                <div className="mb-6 p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="text-sm text-green-700">
                        Open: {studio.Availability.Open} - {studio.Availability.Close}
                    </div>
                </div>

                {/* Booking Button */}
                <Booking studio={studio} />
            </div>
        </div>
    )
}

export default memo(StudioCard)