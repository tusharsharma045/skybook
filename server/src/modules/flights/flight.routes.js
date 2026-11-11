import { Router } from 'express';
import * as flightController from './flight.controller.js';
import { validate } from '../../middlewares/validate.js';
import { optionalAuthenticate } from '../../middlewares/auth.js';
import { airportSearchSchema, flightSearchSchema } from './flight.schema.js';

const router = Router();

// Public flight endpoints
router.get('/airports', validate(airportSearchSchema), flightController.searchAirports);
router.get('/popular', flightController.getPopular);
router.post('/search', optionalAuthenticate, validate(flightSearchSchema), flightController.searchFlights);
router.get('/offers/:offerId', flightController.getOffer);

export default router;
