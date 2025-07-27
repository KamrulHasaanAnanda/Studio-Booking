import { NextRequest, NextResponse } from 'next/server';
import studiosData from '@/shared/utils/data.json';

// Type definitions for better type safety
interface Studio {
    Id: number;
    Name: string;
    Type: string;
    Location: {
        City: string;
        Area: string;
        Address: string;
        Coordinates: {
            Latitude: number;
            Longitude: number;
        };
    };
    Contact: {
        Phone: string;
        Email: string;
    };
    Amenities: string[];
    Description: string;
    PricePerHour: number;
    Currency: string;
    Availability: {
        Open: string;
        Close: string;
    };
    Rating: number;
    Images: string[];
}

interface StudiosData {
    Studios: Studio[];
}

const studios: Studio[] = (studiosData as StudiosData).Studios;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const location = searchParams.get('location') || '';


        if (page < 1 || limit < 1) {
            return NextResponse.json(
                { success: false, error: 'Page and limit must be greater than 0' },
                { status: 400 }
            );
        }

        const totalStudios = studios.length;
        const totalPages = Math.ceil(totalStudios / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;


        const paginatedStudios = studios.slice(startIndex, endIndex);

        return NextResponse.json({
            success: true,
            data: paginatedStudios,
            pagination: {
                currentPage: page,
                totalPages,
                totalStudios,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        console.error('Error fetching studios:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch studios' },
            { status: 500 }
        );
    }
}


