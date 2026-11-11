import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    phone: z.string().optional().nullable(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
  }),
});

export const savedPassengerSchema = z.object({
  body: z.object({
    type: z.enum(['ADULT', 'CHILD', 'INFANT']).default('ADULT'),
    title: z.string().optional().default('Mr'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.string().optional().nullable(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'UNDISCLOSED']).optional().default('MALE'),
    nationality: z.string().optional().default('US'),
    passportNumber: z.string().optional().nullable(),
    passportExpiry: z.string().optional().nullable(),
  }),
});
