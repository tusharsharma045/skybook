export interface Airport {
  iataCode: string;
  name: string;
  city: string;
  country: string;
  countryCode?: string;
  timezone?: string;
}

export interface Segment {
  id: string;
  origin: {
    code: string;
    name: string;
    city: string;
    terminal?: string;
  };
  destination: {
    code: string;
    name: string;
    city: string;
    terminal?: string;
  };
  departureTime: string;
  arrivalTime: string;
  carrier: {
    code: string;
    name: string;
    logoUrl?: string;
  };
  flightNumber: string;
  aircraft: {
    name: string;
  };
  cabinClass: string;
  durationMinutes: number;
  layoverMinutes?: number;
  baggage: {
    checked: string;
    cabin: string;
  };
}

export interface Slice {
  id: string;
  origin: Airport;
  destination: Airport;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  stopsCount: number;
  segments: Segment[];
}

export interface FlightOffer {
  id: string;
  totalAmount: string;
  baseAmount: string;
  taxAmount: string;
  totalCurrency: string;
  airline: {
    code: string;
    name: string;
    logoUrl?: string;
  };
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  passengerCount: number;
  slices: Slice[];
  fareConditions: {
    refundable: boolean;
    changeAllowed: boolean;
    penaltyFee?: string;
  };
  expiresAt: string;
}

export interface FlightSearchFilters {
  stops: 'all' | 'direct' | '1stop';
  airlines: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy: 'cheapest' | 'fastest' | 'best' | 'departure';
}

export interface SearchCriteria {
  origin: string;
  originDetails?: Airport;
  destination: string;
  destinationDetails?: Airport;
  departureDate: string;
  returnDate?: string;
  tripType: 'ONE_WAY' | 'ROUND_TRIP';
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
}
