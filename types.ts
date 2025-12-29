export enum EventType {
  SIGHTSEEING = 'SIGHTSEEING',
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  STAY = 'STAY',
  SHOPPING = 'SHOPPING',
}

export interface TravelEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  endTime?: string;
  title: string;
  location?: string;
  type: EventType;
  description?: string;
  coordinates?: { lat: number; lng: number };
  photoUrl?: string;
}

export interface Booking {
  id: string;
  type: 'FLIGHT' | 'HOTEL' | 'CAR' | 'TICKET' | 'TRAIN';
  title: string;
  subTitle?: string; // Airline, Hotel Brand
  date: string; // Start Date YYYY-MM-DD
  endDate?: string; // For Hotels
  time?: string; // HH:mm
  endTime?: string; // HH:mm
  location?: string; // Departure Airport / Hotel Address
  endLocation?: string; // Arrival Airport
  referenceCode?: string; // PNR / Confirmation
  price?: string;
  fileUrl?: string; 
  isSecure: boolean; // Requires PIN
  imageUrl?: string; // For Hotels
  details?: {
    seat?: string;
    terminal?: string;
    gate?: string;
    flightNumber?: string;
    roomType?: string;
    guests?: number;
  };
}

export interface Expense {
  id: string;
  amount: number;
  currency: 'TWD' | 'USD';
  category: string;
  date: string;
  payerId: string;
  splitBetween: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  authorId: string;
  content: string;
  imageUrls: string[];
}

export interface PlanningItem {
  id: string;
  type: 'TODO' | 'PACKING' | 'SHOPPING';
  text: string;
  completed: boolean;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
}

export interface WeatherData {
  temp: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy';
}