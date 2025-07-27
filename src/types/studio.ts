export interface Studio {
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

export interface Booking {
    studioId: number;
    studioName: string;
    date: string;
    timeSlot: string;
    name: string;
    email: string;
} 