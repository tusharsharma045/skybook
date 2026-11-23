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
      dateOfBirth: '',
      gender: 'MALE',
      nationality: 'IN',
      passportNumber: '',
      passportExpiry: '',
      seatNumber: '',
      baggageAllowance: '15kg check-in, 7kg cabin',
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
                dateOfBirth: '',
                gender: 'MALE',
                nationality: 'IN',
                passportNumber: '',
                passportExpiry: '',
                seatNumber: '',
                baggageAllowance: '15kg check-in, 7kg cabin',
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
