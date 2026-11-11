import { Duffel } from '@duffel/api';
import { FlightProvider } from './FlightProvider.interface.js';
import { SimulatedFlightProvider } from './SimulatedFlightProvider.js';
import { flightCache } from './flightCache.js';
import { logger } from '../../config/logger.js';

export class DuffelFlightProvider extends FlightProvider {
  constructor(apiToken) {
    super();
    this.token = apiToken;
    this.duffel = new Duffel({ token: apiToken });
    this.fallbackProvider = new SimulatedFlightProvider();
  }

  async searchAirports(query) {
    if (!query || query.trim().length === 0) return [];
    const cacheKey = `airports:${query.toLowerCase().trim()}`;
    const cached = flightCache.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.duffel.suggestions.list({ query });
      if (response && response.data && response.data.length > 0) {
        const results = response.data.map((item) => ({
          iataCode: item.iata_code || item.id,
          name: item.name,
          city: item.city_name || item.name,
          country: item.country_name || 'International',
          countryCode: item.iata_country_code || 'XX',
          timeZone: item.time_zone || 'UTC',
        }));
        flightCache.set(cacheKey, results, 3600);
        return results;
      }
    } catch (err) {
      logger.warn(`Duffel airport autocomplete fallback: ${err.message}`);
    }

    return this.fallbackProvider.searchAirports(query);
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
      cabinClass = 'economy',
    } = params;

    const cacheKey = `search:duffel:${origin}-${destination}-${departureDate}-${returnDate || 'oneway'}-${adults}-${children}-${infants}-${cabinClass}`;
    const cached = flightCache.get(cacheKey);
    if (cached) return cached;

    try {
      const passengers = [];
      for (let i = 0; i < adults; i++) passengers.push({ type: 'adult' });
      for (let i = 0; i < children; i++) passengers.push({ type: 'child' });
      for (let i = 0; i < infants; i++) passengers.push({ type: 'infant_without_seat' });

      const slices = [
        {
          origin,
          destination,
          departure_date: departureDate,
        },
      ];

      if (returnDate) {
        slices.push({
          origin: destination,
          destination: origin,
          departure_date: returnDate,
        });
      }

      const offerRequest = await this.duffel.offerRequests.create({
        slices,
        passengers,
        cabin_class: cabinClass.toLowerCase(),
        return_offers: true,
      });

      if (offerRequest && offerRequest.data && offerRequest.data.offers && offerRequest.data.offers.length > 0) {
        const transformedOffers = offerRequest.data.offers.map((raw) => {
          const firstSlice = raw.slices[0];
          const firstSegment = firstSlice.segments[0];
          const airline = {
            code: raw.owner.iata_code || 'XX',
            name: raw.owner.name,
            logoUrl: raw.owner.logo_symbol_url || `https://images.kiwi.com/airlines/64/${raw.owner.iata_code}.png`,
          };

          const formattedSlices = raw.slices.map((slice, sIdx) => ({
            id: slice.id || `slice_${sIdx}`,
            origin: {
              iataCode: slice.origin.iata_code,
              name: slice.origin.name,
              city: slice.origin.city_name || slice.origin.name,
            },
            destination: {
              iataCode: slice.destination.iata_code,
              name: slice.destination.name,
              city: slice.destination.city_name || slice.destination.name,
            },
            departureTime: slice.segments[0].departing_at,
            arrivalTime: slice.segments[slice.segments.length - 1].arriving_at,
            durationMinutes: parseDuration(slice.duration),
            stopsCount: slice.segments.length - 1,
            segments: slice.segments.map((seg, segIdx) => ({
              id: seg.id || `seg_${segIdx}`,
              origin: {
                code: seg.origin.iata_code,
                name: seg.origin.name,
                city: seg.origin.city_name,
                terminal: seg.origin_terminal,
              },
              destination: {
                code: seg.destination.iata_code,
                name: seg.destination.name,
                city: seg.destination.city_name,
                terminal: seg.destination_terminal,
              },
              departureTime: seg.departing_at,
              arrivalTime: seg.arriving_at,
              carrier: {
                code: seg.operating_carrier?.iata_code || airline.code,
                name: seg.operating_carrier?.name || airline.name,
                logoUrl: seg.operating_carrier?.logo_symbol_url || airline.logoUrl,
              },
              flightNumber: `${seg.operating_carrier?.iata_code || airline.code} ${seg.operating_carrier_flight_number || '101'}`,
              aircraft: { name: seg.aircraft?.name || 'Commercial Aircraft' },
              cabinClass: cabinClass.toUpperCase(),
              durationMinutes: parseDuration(seg.duration),
              baggage: {
                checked: '1 x 23kg',
                cabin: '1 x 8kg carry-on',
              },
            })),
          }));

          const offer = {
            id: raw.id,
            totalAmount: raw.total_amount,
            baseAmount: raw.base_amount || raw.total_amount,
            taxAmount: raw.tax_amount || '0.00',
            totalCurrency: raw.total_currency || 'USD',
            airline,
            cabinClass: cabinClass.toUpperCase(),
            passengerCount: passengers.length,
            slices: formattedSlices,
            fareConditions: {
              refundable: raw.conditions?.refund_before_departure?.allowed ?? false,
              changeAllowed: raw.conditions?.change_before_departure?.allowed ?? true,
              penaltyFee: raw.conditions?.refund_before_departure?.penalty_amount || '100.00',
            },
            expiresAt: raw.expires_at || new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          };

          flightCache.set(`offer:${offer.id}`, offer, 3600);
          return offer;
        });

        flightCache.set(cacheKey, transformedOffers, 300);
        return transformedOffers;
      }
    } catch (err) {
      logger.warn(`Duffel API request fallback to simulated: ${err.message}`);
    }

    return this.fallbackProvider.searchOffers(params);
  }

  async getOffer(offerId) {
    const cached = flightCache.get(`offer:${offerId}`);
    if (cached) return cached;

    try {
      const response = await this.duffel.offers.get(offerId);
      if (response && response.data) {
        // Cached through search or transformed here
        return response.data;
      }
    } catch (err) {
      logger.warn(`Duffel getOffer error: ${err.message}`);
    }

    return this.fallbackProvider.getOffer(offerId);
  }
}

function parseDuration(isoDuration) {
  if (!isoDuration) return 480;
  // Format like 'PT7H45M' or 'PT2H'
  const hours = isoDuration.match(/(\d+)H/);
  const minutes = isoDuration.match(/(\d+)M/);
  const h = hours ? parseInt(hours[1], 10) : 0;
  const m = minutes ? parseInt(minutes[1], 10) : 0;
  return h * 60 + m || 480;
}
