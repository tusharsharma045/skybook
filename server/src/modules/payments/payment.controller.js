import * as paymentService from './payment.service.js';
import { sendSuccess } from '../../utils/response.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const processPayment = asyncHandler(async (req, res) => {
  const result = await paymentService.processBookingPayment(req.user.id, req.body);
  return sendSuccess(res, 200, 'Payment confirmed successfully', result);
});
