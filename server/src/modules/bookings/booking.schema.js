import { z } from 'zod';

export const passengerSchema = z.object({
  type: z.enum(['ADULT', 'CHILD', 'INFANT']).default('ADULT'),
  title: z.string().optional().default('Mr'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'UNDISCLOSED']).optional().default('MALE'),
  nationality: z.string().optional().default('US'),
  passportNumber: z.string().min(4, 'Passport number must be at least 4 chars').optional().or(z.literal('')),
  passportExpiry: z.string().optional().nullable(),
  seatNumber: z.string().optional(),
  baggageAllowance: z.string().optional(),
});

export const createBookingSchema = z.object({
  body: z.object({
    offerId: z.string().min(1, 'Offer ID is required'),
    passengers: z.array(passengerSchema).min(1, 'At least one passenger is required'),
    contactEmail: z.string().email('Please enter a valid contact email'),
    contactPhone: z.string().optional(),
    notes: z.string().optional(),
    savePassengersToProfile: z.boolean().optional().default(false),
  }),
});

export const cancelBookingSchema = z.object({
  body: z.object({
    reason: z.string().optional(),
  }),
});
