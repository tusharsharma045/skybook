import { Airport, FlightOffer, FlightSearchFilters, SearchCriteria, Slice, Segment } from './flights.types';

export const MAJOR_AIRPORTS: Airport[] = [
  // Top Indian Hubs
  { iataCode: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'CCU', name: 'Netaji Subhash Chandra Bose International Airport', city: 'Kolkata', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'COK', name: 'Cochin International Airport', city: 'Kochi', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'GOI', name: 'Dabolim Airport', city: 'Goa (Dabolim)', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'GOX', name: 'Manohar International Airport', city: 'Goa (Mopa)', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'PNQ', name: 'Pune International Airport', city: 'Pune', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'LKO', name: 'Chaudhary Charan Singh International Airport', city: 'Lucknow', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'IXC', name: 'Shaheed Bhagat Singh International Airport', city: 'Chandigarh', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'ATQ', name: 'Sri Guru Ram Dass Jee International Airport', city: 'Amritsar', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'GAU', name: 'Lokpriya Gopinath Bordoloi International Airport', city: 'Guwahati', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'BBI', name: 'Biju Patnaik International Airport', city: 'Bhubaneswar', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'PAT', name: 'Jay Prakash Narayan International Airport', city: 'Patna', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'VNS', name: 'Lal Bahadur Shastri International Airport', city: 'Varanasi', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'SXR', name: 'Sheikh ul-Alam International Airport', city: 'Srinagar', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'IXB', name: 'Bagdogra Airport', city: 'Siliguri / Bagdogra', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'TRV', name: 'Thiruvananthapuram International Airport', city: 'Trivandrum', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'IXE', name: 'Mangaluru International Airport', city: 'Mangaluru', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'NAG', name: 'Dr. Babasaheb Ambedkar International Airport', city: 'Nagpur', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'IDR', name: 'Devi Ahilya Bai Holkar Airport', city: 'Indore', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'UDR', name: 'Maharana Pratap Airport', city: 'Udaipur', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'IXR', name: 'Birsa Munda Airport', city: 'Ranchi', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },
  { iataCode: 'IXL', name: 'Kushok Bakula Rimpochee Airport', city: 'Leh', country: 'India', countryCode: 'IN', timezone: 'Asia/Kolkata' },

  // Key International Hubs Connected with India
  { iataCode: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', timezone: 'Asia/Dubai' },
  { iataCode: 'AUH', name: 'Zayed International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates', countryCode: 'AE', timezone: 'Asia/Dubai' },
  { iataCode: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', countryCode: 'QA', timezone: 'Asia/Qatar' },
  { iataCode: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', countryCode: 'SG', timezone: 'Asia/Singapore' },
  { iataCode: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', countryCode: 'TH', timezone: 'Asia/Bangkok' },
  { iataCode: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', timezone: 'Asia/Kuala_Lumpur' },
  { iataCode: 'DPS', name: 'Ngurah Rai International Airport', city: 'Bali', country: 'Indonesia', countryCode: 'ID', timezone: 'Asia/Makassar' },
  { iataCode: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', countryCode: 'GB', timezone: 'Europe/London' },
  { iataCode: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', countryCode: 'FR', timezone: 'Europe/Paris' },
  { iataCode: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', countryCode: 'DE', timezone: 'Europe/Berlin' },
  { iataCode: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', countryCode: 'US', timezone: 'America/New_York' },
  { iataCode: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States', countryCode: 'US', timezone: 'America/Los_Angeles' },
  { iataCode: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', countryCode: 'CA', timezone: 'America/Toronto' },
  { iataCode: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', countryCode: 'AU', timezone: 'Australia/Sydney' },
  { iataCode: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', countryCode: 'AU', timezone: 'Australia/Melbourne' },
  { iataCode: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', countryCode: 'JP', timezone: 'Asia/Tokyo' },
];

const AIRLINES = [
  { code: '6E', name: 'IndiGo', logo: 'https://images.kiwi.com/airlines/64/6E.png', hub: 'DEL' },
  { code: 'AI', name: 'Air India', logo: 'https://images.kiwi.com/airlines/64/AI.png', hub: 'DEL' },
  { code: 'UK', name: 'Vistara', logo: 'https://images.kiwi.com/airlines/64/UK.png', hub: 'DEL' },
  { code: 'QP', name: 'Akasa Air', logo: 'https://images.kiwi.com/airlines/64/QP.png', hub: 'BOM' },
  { code: 'SG', name: 'SpiceJet', logo: 'https://images.kiwi.com/airlines/64/SG.png', hub: 'BOM' },
  { code: 'IX', name: 'Air India Express', logo: 'https://images.kiwi.com/airlines/64/IX.png', hub: 'COK' },
  { code: 'EK', name: 'Emirates', logo: 'https://images.kiwi.com/airlines/64/EK.png', hub: 'DXB' },
  { code: 'SQ', name: 'Singapore Airlines', logo: 'https://images.kiwi.com/airlines/64/SQ.png', hub: 'SIN' },
  { code: 'QR', name: 'Qatar Airways', logo: 'https://images.kiwi.com/airlines/64/QR.png', hub: 'DOH' },
  { code: 'BA', name: 'British Airways', logo: 'https://images.kiwi.com/airlines/64/BA.png', hub: 'LHR' },
];

const AIRCRAFT_TYPES = [
  'Airbus A321neo',
  'Airbus A320neo',
  'Boeing 737 MAX 8',
  'Boeing 787-9 Dreamliner',
  'Airbus A350-900',
  'Boeing 777-300ER',
];

export const getAirportByCode = (code: string): Airport => {
  const found = MAJOR_AIRPORTS.find((a) => a.iataCode.toUpperCase() === code.toUpperCase());
  if (found) return found;
  return {
    iataCode: code.toUpperCase(),
    name: `${code.toUpperCase()} International Airport`,
    city: code.toUpperCase(),
    country: 'India',
    countryCode: 'IN',
  };
};

export const simulatedFlights = {
  searchAirports: (query: string): Airport[] => {
    if (!query || query.trim().length === 0) return MAJOR_AIRPORTS.slice(0, 8);
    const q = query.toLowerCase().trim();
    return MAJOR_AIRPORTS.filter((a) =>
      a.iataCode.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
    ).slice(0, 10);
  },

  searchOffers: (
    criteria: SearchCriteria,
    filters?: Partial<FlightSearchFilters>
  ): { offers: FlightOffer[]; meta: any } => {
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      tripType,
      passengers,
      cabinClass = 'ECONOMY',
    } = criteria;

    const adults = passengers.adults || 1;
    const children = passengers.children || 0;
    const infants = passengers.infants || 0;
    const passengerCount = adults + children + infants;

    const originAirport = getAirportByCode(origin);
    const destAirport = getAirportByCode(destination);
    const isDomestic = originAirport.countryCode === 'IN' && destAirport.countryCode === 'IN';

    const CABIN_MULTIPLIERS: Record<string, number> = {
      ECONOMY: 1.0,
      PREMIUM_ECONOMY: 1.5,
      BUSINESS: 3.0,
      FIRST: 5.5,
    };
    const cabinMultiplier = CABIN_MULTIPLIERS[cabinClass.toUpperCase()] || 1.0;

    const availableAirlines = isDomestic
      ? AIRLINES.filter((a) => ['6E', 'AI', 'UK', 'QP', 'SG', 'IX'].includes(a.code))
      : AIRLINES;

    const offers: FlightOffer[] = [];

    availableAirlines.forEach((airline, index) => {
      const isDirect = index % 3 !== 0 || isDomestic;
      const baseFlightTimeMinutes = isDomestic
        ? 85 + ((index * 25) % 60)
        : 380 + ((index * 55) % 240);

      // In Indian Rupees
      const basePriceInr = isDomestic
        ? Math.round((3650 + ((index * 720) % 3500)) * cabinMultiplier)
        : Math.round((24500 + ((index * 4800) % 26000)) * cabinMultiplier);

      const totalPrice = (
        basePriceInr * adults +
        Math.round(basePriceInr * 0.8) * children +
        Math.round(basePriceInr * 0.15) * infants
      ) * (returnDate && tripType === 'ROUND_TRIP' ? 1.9 : 1);

      const depHour = 6 + ((index * 2 + 1) % 15);
      const depMinute = (index * 15) % 60;
      const depDate = new Date(`${departureDate}T${String(depHour).padStart(2, '0')}:${String(depMinute).padStart(2, '0')}:00Z`);

      const baggageRule = isDomestic
        ? { checked: '15 kg check-in baggage', cabin: '7 kg hand baggage' }
        : { checked: cabinClass === 'ECONOMY' ? '23 kg check-in baggage' : '2 x 32 kg', cabin: '8 kg carry-on' };

      const outboundSegments: Segment[] = [];

      if (isDirect) {
        const arrDate = new Date(depDate.getTime() + baseFlightTimeMinutes * 60 * 1000);
        outboundSegments.push({
          id: `seg_${airline.code}_${index}_1`,
          origin: {
            code: originAirport.iataCode,
            name: originAirport.name,
            city: originAirport.city,
            terminal: isDomestic ? 'T1' : 'T3',
          },
          destination: {
            code: destAirport.iataCode,
            name: destAirport.name,
            city: destAirport.city,
            terminal: isDomestic ? 'T2' : 'T3',
          },
          departureTime: depDate.toISOString(),
          arrivalTime: arrDate.toISOString(),
          carrier: {
            code: airline.code,
            name: airline.name,
            logoUrl: airline.logo,
          },
          flightNumber: `${airline.code} ${isDomestic ? 200 + index * 14 : 100 + index * 12}`,
          aircraft: { name: AIRCRAFT_TYPES[index % AIRCRAFT_TYPES.length] },
          cabinClass,
          durationMinutes: baseFlightTimeMinutes,
          baggage: baggageRule,
        });
      } else {
        const layoverAirport = getAirportByCode(airline.hub);
        const leg1Duration = Math.round(baseFlightTimeMinutes * 0.45);
        const layoverDuration = 75 + (index * 20) % 60;
        const leg2Duration = Math.round(baseFlightTimeMinutes * 0.55);

        const arrLeg1 = new Date(depDate.getTime() + leg1Duration * 60 * 1000);
        const depLeg2 = new Date(arrLeg1.getTime() + layoverDuration * 60 * 1000);
        const arrLeg2 = new Date(depLeg2.getTime() + leg2Duration * 60 * 1000);

        outboundSegments.push({
          id: `seg_${airline.code}_${index}_1`,
          origin: {
            code: originAirport.iataCode,
            name: originAirport.name,
            city: originAirport.city,
            terminal: 'T1',
          },
          destination: {
            code: layoverAirport.iataCode,
            name: layoverAirport.name,
            city: layoverAirport.city,
            terminal: 'T3',
          },
          departureTime: depDate.toISOString(),
          arrivalTime: arrLeg1.toISOString(),
          carrier: {
            code: airline.code,
            name: airline.name,
            logoUrl: airline.logo,
          },
          flightNumber: `${airline.code} ${500 + index * 6}`,
          aircraft: { name: AIRCRAFT_TYPES[(index + 1) % AIRCRAFT_TYPES.length] },
          cabinClass,
          durationMinutes: leg1Duration,
          layoverMinutes: layoverDuration,
          baggage: baggageRule,
        });

        outboundSegments.push({
          id: `seg_${airline.code}_${index}_2`,
          origin: {
            code: layoverAirport.iataCode,
            name: layoverAirport.name,
            city: layoverAirport.city,
            terminal: 'T3',
          },
          destination: {
            code: destAirport.iataCode,
            name: destAirport.name,
            city: destAirport.city,
            terminal: isDomestic ? 'T2' : 'T3',
          },
          departureTime: depLeg2.toISOString(),
          arrivalTime: arrLeg2.toISOString(),
          carrier: {
            code: airline.code,
            name: airline.name,
            logoUrl: airline.logo,
          },
          flightNumber: `${airline.code} ${501 + index * 6}`,
          aircraft: { name: AIRCRAFT_TYPES[index % AIRCRAFT_TYPES.length] },
          cabinClass,
          durationMinutes: leg2Duration,
          baggage: baggageRule,
        });
      }

      const outboundSlice: Slice = {
        id: `sli_out_${index}`,
        origin: originAirport,
        destination: destAirport,
        departureTime: outboundSegments[0].departureTime,
        arrivalTime: outboundSegments[outboundSegments.length - 1].arrivalTime,
        durationMinutes: outboundSegments.reduce((acc, s) => acc + s.durationMinutes + (s.layoverMinutes || 0), 0),
        stopsCount: outboundSegments.length - 1,
        segments: outboundSegments,
      };

      const slices: Slice[] = [outboundSlice];

      // Return slice if round trip
      if (returnDate && tripType === 'ROUND_TRIP') {
        const retDepDate = new Date(`${returnDate}T10:30:00Z`);
        const retArrDate = new Date(retDepDate.getTime() + baseFlightTimeMinutes * 60 * 1000);
        slices.push({
          id: `sli_ret_${index}`,
          origin: destAirport,
          destination: originAirport,
          departureTime: retDepDate.toISOString(),
          arrivalTime: retArrDate.toISOString(),
          durationMinutes: baseFlightTimeMinutes,
          stopsCount: 0,
          segments: [
            {
              id: `seg_ret_${airline.code}_${index}`,
              origin: {
                code: destAirport.iataCode,
                name: destAirport.name,
                city: destAirport.city,
                terminal: 'T2',
              },
              destination: {
                code: originAirport.iataCode,
                name: originAirport.name,
                city: originAirport.city,
                terminal: 'T3',
              },
              departureTime: retDepDate.toISOString(),
              arrivalTime: retArrDate.toISOString(),
              carrier: {
                code: airline.code,
                name: airline.name,
                logoUrl: airline.logo,
              },
              flightNumber: `${airline.code} ${900 + index * 4}`,
              aircraft: { name: AIRCRAFT_TYPES[index % AIRCRAFT_TYPES.length] },
              cabinClass,
              durationMinutes: baseFlightTimeMinutes,
              baggage: baggageRule,
            },
          ],
        });
      }

      offers.push({
        id: `off_sim_${airline.code}_${index}_${Date.now()}`,
        totalAmount: totalPrice.toFixed(2),
        baseAmount: (totalPrice * 0.85).toFixed(2),
        taxAmount: (totalPrice * 0.15).toFixed(2),
        totalCurrency: 'INR',
        airline: {
          code: airline.code,
          name: airline.name,
          logoUrl: airline.logo,
        },
        cabinClass: cabinClass as any,
        passengerCount,
        slices,
        fareConditions: {
          refundable: index % 2 === 0,
          changeAllowed: true,
          penaltyFee: index % 2 === 0 ? '₹1,500' : 'Non-refundable',
        },
        expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
      });
    });

    // Apply filters
    let filteredOffers = [...offers];

    if (filters?.stops === 'direct') {
      filteredOffers = filteredOffers.filter((o) => o.slices[0].stopsCount === 0);
    } else if (filters?.stops === '1stop') {
      filteredOffers = filteredOffers.filter((o) => o.slices[0].stopsCount <= 1);
    }

    if (filters?.airlines && filters.airlines.length > 0) {
      filteredOffers = filteredOffers.filter((o) => filters.airlines!.includes(o.airline.code));
    }

    if (typeof filters?.minPrice === 'number') {
      filteredOffers = filteredOffers.filter((o) => parseFloat(o.totalAmount) >= filters.minPrice!);
    }

    if (typeof filters?.maxPrice === 'number') {
      filteredOffers = filteredOffers.filter((o) => parseFloat(o.totalAmount) <= filters.maxPrice!);
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'cheapest';
    filteredOffers.sort((a, b) => {
      const priceA = parseFloat(a.totalAmount);
      const priceB = parseFloat(b.totalAmount);
      const durA = a.slices[0].durationMinutes;
      const durB = b.slices[0].durationMinutes;

      if (sortBy === 'cheapest') return priceA - priceB;
      if (sortBy === 'fastest') return durA - durB;
      if (sortBy === 'departure') {
        return new Date(a.slices[0].departureTime).getTime() - new Date(b.slices[0].departureTime).getTime();
      }
      return priceA - priceB;
    });

    const prices = offers.map((o) => parseFloat(o.totalAmount));
    const minPrice = prices.length > 0 ? Math.min(...prices) : 3000;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 15000;

    return {
      offers: filteredOffers,
      meta: {
        totalFound: offers.length,
        matchingFilters: filteredOffers.length,
        priceRange: { min: minPrice, max: maxPrice },
        availableAirlines: Array.from(new Set(offers.map((o) => o.airline.code))),
      },
    };
  },
};
