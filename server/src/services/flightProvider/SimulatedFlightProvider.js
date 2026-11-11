import { FlightProvider } from './FlightProvider.interface.js';
import { searchAirportsLocal, getAirportByCode } from './airportsData.js';
import { flightCache } from './flightCache.js';

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

export class SimulatedFlightProvider extends FlightProvider {
  async searchAirports(query) {
    const cacheKey = `airports:${query.toLowerCase().trim()}`;
    const cached = flightCache.get(cacheKey);
    if (cached) return cached;

    const results = searchAirportsLocal(query);
    flightCache.set(cacheKey, results, 3600); // 1 hour TTL
    return results;
  }

  async searchOffers(params) {
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      adults = 1,
      children = 0,
      infants = 0,
      cabinClass = 'ECONOMY',
    } = params;

    const cacheKey = `search:${origin}-${destination}-${departureDate}-${returnDate || 'oneway'}-${adults}-${children}-${infants}-${cabinClass}`;
    const cached = flightCache.get(cacheKey);
    if (cached) return cached;

    const originAirport = getAirportByCode(origin);
    const destAirport = getAirportByCode(destination);

    const isDomestic = originAirport.countryCode === 'IN' && destAirport.countryCode === 'IN';
    const passengerCount = adults + children + infants;
    const offers = [];

    // Base pricing multiplier by cabin
    const cabinMultiplier = {
      ECONOMY: 1.0,
      PREMIUM_ECONOMY: 1.5,
      BUSINESS: 3.0,
      FIRST: 5.5,
    }[cabinClass.toUpperCase()] || 1.0;

    // Filter relevant airlines (Indian domestic vs International)
    const availableAirlines = isDomestic
      ? AIRLINES.filter((a) => ['6E', 'AI', 'UK', 'QP', 'SG', 'IX'].includes(a.code))
      : AIRLINES;

    availableAirlines.forEach((airline, index) => {
      const isDirect = index % 3 !== 0 || isDomestic; // Domestic mostly direct
      const baseFlightTimeMinutes = isDomestic
        ? 80 + ((index * 25) % 60) // 1h 20m to 2h 20m for India domestic
        : 380 + ((index * 55) % 240); // 6h to 10h for international

      // In Indian Rupees (INR)
      const basePriceInr = isDomestic
        ? Math.round((3650 + ((index * 720) % 3500)) * cabinMultiplier)
        : Math.round((24500 + ((index * 4800) % 26000)) * cabinMultiplier);

      const totalPrice = (
        basePriceInr * adults +
        Math.round(basePriceInr * 0.8) * children +
        Math.round(basePriceInr * 0.15) * infants
      ) * (returnDate ? 1.9 : 1);

      // Departure schedule
      const depHour = 6 + ((index * 2 + 1) % 15);
      const depMinute = (index * 15) % 60;
      const depDate = new Date(`${departureDate}T${String(depHour).padStart(2, '0')}:${String(depMinute).padStart(2, '0')}:00Z`);

      const outboundSegments = [];
      const baggageRule = isDomestic
        ? { checked: '15 kg check-in baggage', cabin: '7 kg hand baggage' }
        : { checked: cabinClass === 'ECONOMY' ? '23 kg check-in baggage' : '2 x 32 kg', cabin: '8 kg carry-on' };

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
        // 1 Stop via airline hub
        const layoverAirport = getAirportByCode(airline.hub);
        const leg1Duration = Math.round(baseFlightTimeMinutes * 0.45);
        const layoverDuration = 75 + (index * 20) % 60; // 75 to 135 min
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
            terminal: 'T2',
          },
          departureTime: depLeg2.toISOString(),
          arrivalTime: arrLeg2.toISOString(),
          carrier: {
            code: airline.code,
            name: airline.name,
            logoUrl: airline.logo,
          },
          flightNumber: `${airline.code} ${600 + index * 6}`,
          aircraft: { name: AIRCRAFT_TYPES[index % AIRCRAFT_TYPES.length] },
          cabinClass,
          durationMinutes: leg2Duration,
          baggage: baggageRule,
        });
      }

      const totalOutboundDuration = outboundSegments.reduce(
        (sum, seg) => sum + seg.durationMinutes + (seg.layoverMinutes || 0),
        0
      );

      const slices = [
        {
          id: `slice_out_${index}`,
          origin: originAirport,
          destination: destAirport,
          departureTime: outboundSegments[0].departureTime,
          arrivalTime: outboundSegments[outboundSegments.length - 1].arrivalTime,
          durationMinutes: totalOutboundDuration,
          stopsCount: outboundSegments.length - 1,
          segments: outboundSegments,
        },
      ];

      // If Round Trip, generate return slice
      if (returnDate) {
        const retDepHour = 8 + ((index * 3) % 12);
        const retDepDate = new Date(`${returnDate}T${String(retDepHour).padStart(2, '0')}:30:00Z`);
        const retArrDate = new Date(retDepDate.getTime() + baseFlightTimeMinutes * 60 * 1000);

        const returnSegments = [
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
              terminal: 'T1',
            },
            departureTime: retDepDate.toISOString(),
            arrivalTime: retArrDate.toISOString(),
            carrier: {
              code: airline.code,
              name: airline.name,
              logoUrl: airline.logo,
            },
            flightNumber: `${airline.code} ${700 + index * 8}`,
            aircraft: { name: AIRCRAFT_TYPES[index % AIRCRAFT_TYPES.length] },
            cabinClass,
            durationMinutes: baseFlightTimeMinutes,
            baggage: baggageRule,
          },
        ];

        slices.push({
          id: `slice_ret_${index}`,
          origin: destAirport,
          destination: originAirport,
          departureTime: returnSegments[0].departureTime,
          arrivalTime: returnSegments[0].arrivalTime,
          durationMinutes: baseFlightTimeMinutes,
          stopsCount: 0,
          segments: returnSegments,
        });
      }

      const offer = {
        id: `off_sky_${originAirport.iataCode}_${destAirport.iataCode}_${airline.code}_${index}_${Date.now().toString(36)}`,
        totalAmount: totalPrice.toFixed(2),
        baseAmount: Math.round(totalPrice * 0.85).toFixed(2),
        taxAmount: Math.round(totalPrice * 0.15).toFixed(2),
        totalCurrency: 'INR',
        airline: {
          code: airline.code,
          name: airline.name,
          logoUrl: airline.logo,
        },
        cabinClass,
        passengerCount,
        slices,
        fareConditions: {
          refundable: index % 2 === 0,
          changeAllowed: true,
          penaltyFee: isDomestic ? '999.00' : '3500.00',
        },
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
      };

      flightCache.set(`offer:${offer.id}`, offer, 3600);
      offers.push(offer);
    });

    flightCache.set(cacheKey, offers, 300);
    return offers;
  }

  async getOffer(offerId) {
    const cached = flightCache.get(`offer:${offerId}`);
    if (cached) return cached;

    // Resilient fallback: parse offer metadata from offerId string
    try {
      const parts = offerId.split('_');
      if (parts.length >= 6) {
        const originCode = parts[2];
        const destCode = parts[3];
        const airlineCode = parts[4];
        const index = parseInt(parts[5], 10) || 0;

        const airline = AIRLINES.find((a) => a.code === airlineCode) || AIRLINES[0];
        const originAirport = getAirportByCode(originCode);
        const destAirport = getAirportByCode(destCode);
        const isDomestic = originAirport.countryCode === 'IN' && destAirport.countryCode === 'IN';

        const depDate = new Date();
        depDate.setDate(depDate.getDate() + 7);
        const durationMin = isDomestic ? 110 : 450;
        const arrDate = new Date(depDate.getTime() + durationMin * 60 * 1000);

        const priceInr = isDomestic ? 4850 + (index * 600) % 3000 : 34000 + (index * 3500) % 20000;

        const reconstructedOffer = {
          id: offerId,
          totalAmount: priceInr.toFixed(2),
          baseAmount: Math.round(priceInr * 0.85).toFixed(2),
          taxAmount: Math.round(priceInr * 0.15).toFixed(2),
          totalCurrency: 'INR',
          airline: {
            code: airline.code,
            name: airline.name,
            logoUrl: airline.logo,
          },
          cabinClass: 'ECONOMY',
          passengerCount: 1,
          slices: [
            {
              id: `slice_out_${index}`,
              origin: originAirport,
              destination: destAirport,
              departureTime: depDate.toISOString(),
              arrivalTime: arrDate.toISOString(),
              durationMinutes: durationMin,
              stopsCount: 0,
              segments: [
                {
                  id: `seg_${airline.code}_1`,
                  origin: {
                    code: originAirport.iataCode,
                    name: originAirport.name,
                    city: originAirport.city,
                    terminal: 'T1',
                  },
                  destination: {
                    code: destAirport.iataCode,
                    name: destAirport.name,
                    city: destAirport.city,
                    terminal: 'T2',
                  },
                  departureTime: depDate.toISOString(),
                  arrivalTime: arrDate.toISOString(),
                  carrier: {
                    code: airline.code,
                    name: airline.name,
                    logoUrl: airline.logo,
                  },
                  flightNumber: `${airline.code} ${isDomestic ? 200 + index * 10 : 100 + index * 10}`,
                  aircraft: { name: isDomestic ? 'Airbus A321neo' : 'Boeing 787-9 Dreamliner' },
                  cabinClass: 'ECONOMY',
                  durationMinutes: durationMin,
                  baggage: isDomestic
                    ? { checked: '15 kg check-in baggage', cabin: '7 kg hand baggage' }
                    : { checked: '23 kg check-in baggage', cabin: '8 kg carry-on' },
                },
              ],
            },
          ],
          fareConditions: {
            refundable: true,
            changeAllowed: true,
            penaltyFee: isDomestic ? '999.00' : '3500.00',
          },
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        };

        flightCache.set(`offer:${offerId}`, reconstructedOffer, 3600);
        return reconstructedOffer;
      }
    } catch (e) {
      // ignore
    }

    throw new Error(`Offer ${offerId} not found or has expired. Please run a new search.`);
  }
}
