import * as flightService from './flight.service.js';
import { sendSuccess } from '../../utils/response.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const searchAirports = asyncHandler(async (req, res) => {
  const query = req.query.q || '';
  const airports = await flightService.searchAirports(query);
  return sendSuccess(res, 200, 'Airports fetched successfully', { airports });
});

export const searchFlights = asyncHandler(async (req, res) => {
  const userId = req.user?.id || null;
  const { offers, meta } = await flightService.searchFlights(req.body, userId);
  return sendSuccess(res, 200, 'Flight offers retrieved', { offers }, meta);
});

export const getOffer = asyncHandler(async (req, res) => {
  const { offerId } = req.params;
  const offer = await flightService.getOfferById(offerId);
  return sendSuccess(res, 200, 'Offer details retrieved', { offer });
});

export const getPopular = asyncHandler(async (req, res) => {
  const destinations = await flightService.getPopularDestinations();
  return sendSuccess(res, 200, 'Popular destinations retrieved', { destinations });
});
