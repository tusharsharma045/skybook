import { Router } from 'express';
import * as bookingController from './booking.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { createBookingSchema, cancelBookingSchema } from './booking.schema.js';

const router = Router();

// All booking routes are protected
router.use(authenticate);

router.post('/', validate(createBookingSchema), bookingController.createBooking);
router.get('/', bookingController.getMyBookings);
router.get('/:reference', bookingController.getBookingDetails);
router.post('/:reference/cancel', validate(cancelBookingSchema), bookingController.cancelBooking);
router.get('/:reference/pdf', bookingController.downloadTicketPdf);

export default router;
