'use client';

import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { toast } from 'sonner';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface BookingProps {
    studio: any;
}

export default function Booking({ studio }: BookingProps) {
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const generateTimeSlots = (open: string, close: string) => {
        const slots: string[] = [];
        let [openHour] = open.split(':').map(Number);
        let [closeHour] = close.split(':').map(Number);

        for (let hour = openHour; hour < closeHour; hour++) {
            slots.push(`${hour}:00 - ${hour + 1}:00`);
        }
        return slots;
    };

    const timeSlots = studio.Availability ? generateTimeSlots(studio.Availability.Open, studio.Availability.Close) : [];

    const getBookings = () => {
        const data = localStorage.getItem('bookings');
        return data ? JSON.parse(data) : [];
    };

    const handleBooking = () => {
        if (!date || !timeSlot || !name || !email) {
            toast.error('Please fill all fields.');
            return;
        }

        const existingBookings = getBookings();

        const isSlotTaken = existingBookings.some(
            (b: any) => b.studioId === studio.Id && b.date === date && b.timeSlot === timeSlot
        );

        if (isSlotTaken) {
            toast.error('The selected time slot is not available. Please choose another time.');
            return;
        }

        const newBooking = {
            studioId: studio.Id,
            studioName: studio.Name,
            date,
            timeSlot,
            name,
            email,
        };

        existingBookings.push(newBooking);
        localStorage.setItem('bookings', JSON.stringify(existingBookings));

        toast.success(`Booking confirmed for ${studio.Name} on ${date} at ${timeSlot}.`);
        setDate('');
        setTimeSlot('');
        setName('');
        setEmail('');
    };


    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} className="w-4 h-4 text-yellow-400" />);
        }
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="w-4 h-4 text-yellow-400" />);
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
        }

        return stars;
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Book Studio
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl">
                <DialogHeader className="pb-6 border-b border-gray-100">
                    <DialogTitle className="text-3xl font-bold text-gray-900 flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">Book Studio</div>
                            <div className="text-sm text-gray-500 font-normal">Complete your booking details</div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 py-6">

                    <div className="xl:col-span-2 space-y-6">

                        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{studio.Name}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{studio.Description}</p>
                                </div>
                                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold truncate">
                                    {studio.Type}
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center mb-4">
                                <div className="flex items-center mr-3">
                                    {renderStars(studio.Rating)}
                                </div>
                                <span className="text-sm font-medium text-gray-700">({studio.Rating})</span>
                            </div>

                            {/* Location */}
                            <div className="flex items-center text-gray-600 mb-4">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm">{studio.Location.Area}, {studio.Location.City}</span>
                            </div>

                            {/* Price */}
                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 font-medium">Price per hour</span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        {studio.PricePerHour} {studio.Currency}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Amenities
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {studio.Amenities.map((amenity: string, index: number) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>


                    </div>


                    <div className="xl:col-span-2 space-y-6">
                        <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }} className="space-y-6">
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Booking Details
                                </h4>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <Label htmlFor="booking-date" className="text-sm font-semibold text-gray-700 mb-2 block">Select Date</Label>
                                        <Input
                                            type="date"
                                            id="booking-date"
                                            name="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="booking-time" className="text-sm font-semibold text-gray-700 mb-2 block">Select Time Slot</Label>
                                        <select
                                            id="booking-time"
                                            name="timeSlot"
                                            value={timeSlot}
                                            onChange={(e) => setTimeSlot(e.target.value)}
                                            className="w-full h-12 border border-gray-200 rounded-lg px-3 focus:border-blue-500 focus:ring-blue-500 bg-white"
                                            autoComplete="off"
                                        >
                                            <option value="">-- Select Time Slot --</option>
                                            {timeSlots.map((slot, index) => (
                                                <option key={index} value={slot}>{slot}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="booking-name" className="text-sm font-semibold text-gray-700 mb-2 block">Full Name</Label>
                                        <Input
                                            id="booking-name"
                                            name="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your full name"
                                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                            autoComplete="name"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="booking-email" className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</Label>
                                        <Input
                                            id="booking-email"
                                            name="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Booking Summary */}
                            {date && timeSlot && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                                    <h4 className="text-lg= font-bold text-blue-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Booking Summary
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Studio:</span>
                                            <span className="font-semibold text-gray-900 truncate">{studio.Name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Date:</span>
                                            <span className="font-semibold text-gray-900">{date}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Time:</span>
                                            <span className="font-semibold text-gray-900">{timeSlot}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-medium">Price:</span>
                                            <span className="font-bold text-blue-600 text-lg">{studio.PricePerHour} {studio.Currency}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={!date || !timeSlot || !name || !email}
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Confirm Booking
                            </Button>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
