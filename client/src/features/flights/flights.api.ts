import { apiClient } from '@/lib/axios';
import { Airport, FlightOffer, FlightSearchFilters, SearchCriteria } from './flights.types';

export const flightsApi = {
  searchAirports: async (query: string): Promise<Airport[]> => {
    if (!query || query.trim().length === 0) return [];
    const res = await apiClient.get('/flights/airports', {
      params: { q: query },
    });
    return res.data?.data?.airports || [];
  },

  searchFlights: async (
    criteria: SearchCriteria,
    filters?: Partial<FlightSearchFilters>
  ): Promise<{ offers: FlightOffer[]; meta: any }> => {
    const payload = {
      origin: criteria.origin,
      destination: criteria.destination,
      departureDate: criteria.departureDate,
      returnDate: criteria.tripType === 'ROUND_TRIP' ? criteria.returnDate : undefined,
      adults: criteria.passengers.adults,
      children: criteria.passengers.children,
      infants: criteria.passengers.infants,
      cabinClass: criteria.cabinClass,
      stops: filters?.stops || 'all',
      airlines: filters?.airlines || [],
      minPrice: filters?.minPrice,
      maxPrice: filters?.maxPrice,
      sortBy: filters?.sortBy || 'cheapest',
    };

    const res = await apiClient.post('/flights/search', payload);
    return {
      offers: res.data?.data?.offers || [],
      meta: res.data?.meta || {},
    };
  },

  getOffer: async (offerId: string): Promise<FlightOffer> => {
    const res = await apiClient.get(`/flights/offers/${offerId}`);
    return res.data?.data?.offer;
  },

  getPopularDestinations: async (): Promise<any[]> => {
    const res = await apiClient.get('/flights/popular');
    return res.data?.data?.destinations || [];
  },
};
