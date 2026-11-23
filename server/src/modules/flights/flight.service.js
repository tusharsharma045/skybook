import { flightProvider } from '../../services/flightProvider/FlightProviderFactory.js';
import { prisma } from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import { getAirportByCode } from '../../services/flightProvider/airportsData.js';

export const searchAirports = async (query) => {
  return await flightProvider.searchAirports(query);
};

export const searchFlights = async (params, userId = null) => {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults = 1,
    children = 0,
    infants = 0,
    cabinClass = 'ECONOMY',
    stops = 'all',
    airlines = [],
    minPrice,
    maxPrice,
    sortBy = 'cheapest',
  } = params;

  if (origin === destination) {
    throw ApiError.badRequest('Origin and destination airports must be different');
  }

  // 1. Fetch offers from provider
  let rawOffers = await flightProvider.searchOffers({
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    cabinClass,
  });

  // 2. Log search history if user is authenticated
  if (userId) {
    try {
      const originAirport = getAirportByCode(origin);
      const destAirport = getAirportByCode(destination);

      await prisma.searchHistory.create({
        data: {
          userId,
          origin,
          originCity: originAirport.city,
          destination,
          destinationCity: destAirport.city,
          departureDate: new Date(departureDate),
          returnDate: returnDate ? new Date(returnDate) : null,
          passengersCount: adults + children + infants,
          cabinClass,
          tripType: returnDate ? 'ROUND_TRIP' : 'ONE_WAY',
        },
      });
    } catch (e) {
      // Non-critical, continue
    }
  }

  // 3. Apply Filters
  let filteredOffers = [...rawOffers];

  if (stops === 'direct') {
    filteredOffers = filteredOffers.filter((off) => off.slices[0].stopsCount === 0);
  } else if (stops === '1stop') {
    filteredOffers = filteredOffers.filter((off) => off.slices[0].stopsCount <= 1);
  }

  if (airlines && airlines.length > 0) {
    filteredOffers = filteredOffers.filter((off) => airlines.includes(off.airline.code));
  }

  if (typeof minPrice === 'number') {
    filteredOffers = filteredOffers.filter((off) => parseFloat(off.totalAmount) >= minPrice);
  }

  if (typeof maxPrice === 'number') {
    filteredOffers = filteredOffers.filter((off) => parseFloat(off.totalAmount) <= maxPrice);
  }

  // 4. Apply Sorting
  filteredOffers.sort((a, b) => {
    const priceA = parseFloat(a.totalAmount);
    const priceB = parseFloat(b.totalAmount);
    const durationA = a.slices[0].durationMinutes;
    const durationB = b.slices[0].durationMinutes;

    if (sortBy === 'cheapest') {
      return priceA - priceB;
    }
    if (sortBy === 'fastest') {
      return durationA - durationB;
    }
    if (sortBy === 'departure') {
      return new Date(a.slices[0].departureTime).getTime() - new Date(b.slices[0].departureTime).getTime();
    }
    if (sortBy === 'best') {
      // Balanced score: 60% price, 40% duration normalized
      const scoreA = priceA + durationA * 0.8;
      const scoreB = priceB + durationB * 0.8;
      return scoreA - scoreB;
    }
    return 0;
  });

  // Calculate metadata (cheapest price, fastest duration, available airlines, price range)
  const allPrices = rawOffers.map((o) => parseFloat(o.totalAmount));
  const availableAirlines = Array.from(
    new Map(rawOffers.map((o) => [o.airline.code, o.airline])).values()
  );

  const meta = {
    totalFound: rawOffers.length,
    matchingFilters: filteredOffers.length,
    priceRange: {
      min: allPrices.length > 0 ? Math.min(...allPrices) : 0,
      max: allPrices.length > 0 ? Math.max(...allPrices) : 0,
    },
    availableAirlines,
  };

  return { offers: filteredOffers, meta };
};

export const getOfferById = async (offerId) => {
  return await flightProvider.getOffer(offerId);
};

export const getPopularDestinations = async () => {
  return [
    {
      id: 'pop_1',
      city: 'Goa',
      country: 'India',
      airportCode: 'GOI',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      startingPrice: 3499,
      tag: 'Beaches & Holidays',
      flightDuration: '1h 15m from BOM',
    },
    {
      id: 'pop_2',
      city: 'Mumbai',
      country: 'India',
      airportCode: 'BOM',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      startingPrice: 4199,
      tag: 'City of Dreams',
      flightDuration: '2h 10m from DEL',
    },
    {
      id: 'pop_3',
      city: 'New Delhi',
      country: 'India',
      airportCode: 'DEL',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      startingPrice: 3899,
      tag: 'Capital Hub',
      flightDuration: '2h 30m from BLR',
    },
    {
      id: 'pop_4',
      city: 'Bengaluru',
      country: 'India',
      airportCode: 'BLR',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      startingPrice: 3999,
      tag: 'Silicon Valley',
      flightDuration: '1h 45m from BOM',
    },
    {
      id: 'pop_5',
      city: 'Srinagar',
      country: 'India',
      airportCode: 'SXR',
      image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
      startingPrice: 4899,
      tag: 'Dal Lake Shikaras',
      flightDuration: '1h 25m from DEL',
    },
    {
      id: 'pop_6',
      city: 'Dubai',
      country: 'United Arab Emirates',
      airportCode: 'DXB',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      startingPrice: 18999,
      tag: 'International Hotspot',
      flightDuration: '3h 45m from DEL',
    },
  ];
};
