import * as bookingService from './booking.service.js';
import { sendSuccess } from '../../utils/response.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.user.id, req.body);
  return sendSuccess(res, 201, 'Booking created successfully', { booking });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getUserBookings(req.user.id);
  return sendSuccess(res, 200, 'User bookings retrieved', { bookings });
});

export const getBookingDetails = asyncHandler(async (req, res) => {
  const { reference } = req.params;
  const booking = await bookingService.getBookingByReference(reference, req.user.id);
  return sendSuccess(res, 200, 'Booking details retrieved', { booking });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { reference } = req.params;
  const { reason } = req.body;
  const booking = await bookingService.cancelBooking(reference, req.user.id, reason);
  return sendSuccess(res, 200, 'Booking cancelled successfully', { booking });
});

export const downloadTicketPdf = asyncHandler(async (req, res) => {
  const { reference } = req.params;
  const pdfBuffer = await bookingService.getBookingTicketPdf(reference, req.user.id);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="SkyBook_Ticket_${reference}.pdf"`);
  res.setHeader('Content-Length', pdfBuffer.length);

  return res.end(pdfBuffer);
});
