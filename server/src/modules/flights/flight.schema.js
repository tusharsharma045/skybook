import { z } from 'zod';

export const airportSearchSchema = z.object({
  query: z.object({
    q: z.string().min(1, 'Search query is required'),
  }),
});

export const flightSearchSchema = z.object({
  body: z.object({
    origin: z.string().length(3, 'Origin must be a 3-letter IATA code').toUpperCase(),
    destination: z.string().length(3, 'Destination must be a 3-letter IATA code').toUpperCase(),
    departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Departure date must be YYYY-MM-DD'),
    returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Return date must be YYYY-MM-DD').optional().nullable(),
    adults: z.number().int().min(1).max(9).default(1),
    children: z.number().int().min(0).max(9).default(0),
    infants: z.number().int().min(0).max(9).default(0),
    cabinClass: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']).default('ECONOMY'),
    // Optional filters & sorting
    stops: z.enum(['all', 'direct', '1stop']).optional().default('all'),
    airlines: z.array(z.string()).optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    sortBy: z.enum(['cheapest', 'fastest', 'best', 'departure']).optional().default('cheapest'),
  }),
});
