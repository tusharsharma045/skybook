import { z } from 'zod';

export const processPaymentSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid('Valid booking ID is required'),
    paymentMethod: z.enum(['CARD', 'MOCK', 'APPLE_PAY', 'GOOGLE_PAY']).default('CARD'),
    cardholderName: z.string().min(2, 'Cardholder name is required'),
    cardNumber: z.string().min(12, 'Card number must be valid').max(19),
    expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Expiry must be MM/YY'),
    cvv: z.string().min(3).max(4),
  }),
});
