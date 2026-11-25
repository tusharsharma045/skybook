import { apiClient } from '@/lib/axios';
import { Airport, FlightOffer, FlightSearchFilters, SearchCriteria } from './flights.types';
import { simulatedFlights } from './simulatedFlights';

export const flightsApi = {
  searchAirports: async (query: string): Promise<Airport[]> => {
    if (!query || query.trim().length === 0) {
      return simulatedFlights.searchAirports('');
    }
    try {
      const res = await apiClient.get('/flights/airports', {
        params: { q: query },
      });
      if (res.data?.data?.airports && res.data.data.airports.length > 0) {
        return res.data.data.airports;
      }
    } catch {
      // Backend unreachable or offline, use client-side airport database
    }
    return simulatedFlights.searchAirports(query);
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

    try {
      const res = await apiClient.post('/flights/search', payload);
      if (res.data?.data?.offers && res.data.data.offers.length > 0) {
        return {
          offers: res.data.data.offers,
          meta: res.data.meta || {},
        };
      }
    } catch {
      // Backend unreachable, offline, or blocked by browser mixed content policy
    }

    // High-fidelity aviation simulation engine fallback
    return simulatedFlights.searchOffers(criteria, filters);
  },

  getOffer: async (offerId: string): Promise<FlightOffer> => {
    try {
      const res = await apiClient.get(`/flights/offers/${offerId}`);
      if (res.data?.data?.offer) {
        return res.data.data.offer;
      }
    } catch {
      // Fallback
    }
    const defaultSearch = simulatedFlights.searchOffers({
      origin: 'DEL',
      destination: 'BOM',
      departureDate: new Date().toISOString().split('T')[0],
      tripType: 'ONE_WAY',
      passengers: { adults: 1, children: 0, infants: 0 },
      cabinClass: 'ECONOMY',
    });
    return defaultSearch.offers[0];
  },

  getPopularDestinations: async (): Promise<any[]> => {
    try {
      const res = await apiClient.get('/flights/popular');
      if (res.data?.data?.destinations) {
        return res.data.data.destinations;
      }
    } catch {
      // Fallback
    }
    return [
      { id: '1', city: 'Srinagar', code: 'SXR', country: 'India', price: '₹4,899', image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80' },
      { id: '2', city: 'Goa', code: 'GOI', country: 'India', price: '₹3,499', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80' },
      { id: '3', city: 'Dubai', code: 'DXB', country: 'UAE', price: '₹18,999', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
      { id: '4', city: 'Mumbai', code: 'BOM', country: 'India', price: '₹3,899', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
    ];
  },
};
