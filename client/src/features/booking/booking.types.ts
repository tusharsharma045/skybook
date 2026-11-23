import { FlightOffer } from '../flights/flights.types';

export interface PassengerData {
  type: 'ADULT' | 'CHILD' | 'INFANT';
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  nationality: string;
  documentType?: string;
  passportNumber?: string;
  passportExpiry?: string;
  seatNumber?: string;
  baggageAllowance?: string;
  mealPreference?: string;
  specialAssistance?: string;
}

export interface BookingDraft {
  flight: FlightOffer | null;
  passengers: PassengerData[];
  contactEmail: string;
  contactPhone: string;
  notes: string;
  savePassengersToProfile: boolean;
}

export interface BookingResponse {
  id: string;
  bookingReference: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED';
  totalAmount: string;
  currency: string;
  duffelOfferId?: string;
  contactEmail: string;
  contactPhone?: string;
  notes?: string;
  createdAt: string;
  passengers: Array<{
    id: string;
    type: string;
    title?: string;
    firstName: string;
    lastName: string;
    seatNumber?: string;
    passportNumber?: string;
    baggageAllowance?: string;
  }>;
  segments: Array<{
    id: string;
    segmentOrder: number;
    originAirport: string;
    originCity: string;
    destinationAirport: string;
    destinationCity: string;
    departureTime: string;
    arrivalTime: string;
    carrierCode: string;
    carrierName: string;
    flightNumber: string;
    aircraft?: string;
    cabinClass: string;
    durationMinutes: number;
  }>;
  payments?: Array<{
    id: string;
    transactionId: string;
    status: string;
    amount: string;
    currency: string;
    paymentMethod?: string;
    createdAt: string;
  }>;
}
