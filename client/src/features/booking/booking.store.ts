import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BookingDraft, PassengerData, BookingResponse } from './booking.types';
import { FlightOffer } from '../flights/flights.types';

interface BookingState {
  currentStep: number; // 1: Passengers, 2: Review, 3: Payment, 4: Confirmation
  draft: BookingDraft;
  createdBooking: BookingResponse | null;

  setStep: (step: number) => void;
  setFlight: (flight: FlightOffer) => void;
  updateDraft: (updates: Partial<BookingDraft>) => void;
  setPassengers: (passengers: PassengerData[]) => void;
  setCreatedBooking: (booking: BookingResponse) => void;
  resetBooking: () => void;
}

const initialDraft: BookingDraft = {
  flight: null,
  passengers: [
    {
      type: 'ADULT',
      title: 'Mr',
      firstName: '',
      lastName: '',
      dateOfBirth: '1992-05-10',
      gender: 'MALE',
      nationality: 'US',
      passportNumber: '',
      passportExpiry: '2032-12-31',
      seatNumber: '14A',
      baggageAllowance: '1 x 23kg check-in, 1 cabin bag',
    },
  ],
  contactEmail: '',
  contactPhone: '',
  notes: '',
  savePassengersToProfile: false,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      draft: initialDraft,
      createdBooking: null,

      setStep: (currentStep) => set({ currentStep }),

      setFlight: (flight) =>
        set((state) => {
          // Adjust passengers count based on flight offer passengerCount
          const count = flight.passengerCount || 1;
          const passengers: PassengerData[] = [];
          for (let i = 0; i < count; i++) {
            passengers.push(
              state.draft.passengers[i] || {
                type: 'ADULT',
                title: 'Mr',
                firstName: '',
                lastName: '',
                dateOfBirth: '1992-05-10',
                gender: 'MALE',
                nationality: 'US',
                passportNumber: '',
                passportExpiry: '2032-12-31',
                seatNumber: `${12 + i}${['A', 'B', 'C', 'D'][i % 4]}`,
                baggageAllowance: '1 x 23kg check-in, 1 cabin bag',
              }
            );
          }

          return {
            draft: {
              ...state.draft,
              flight,
              passengers,
            },
            currentStep: 1,
          };
        }),

      updateDraft: (updates) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...updates,
          },
        })),

      setPassengers: (passengers) =>
        set((state) => ({
          draft: {
            ...state.draft,
            passengers,
          },
        })),

      setCreatedBooking: (createdBooking) =>
        set({ createdBooking, currentStep: 4 }),

      resetBooking: () =>
        set({
          currentStep: 1,
          draft: initialDraft,
          createdBooking: null,
        }),
    }),
    {
      name: 'skybook-booking-draft',
    }
  )
);
