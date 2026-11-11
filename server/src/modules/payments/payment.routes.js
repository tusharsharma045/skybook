import { Router } from 'express';
import * as paymentController from './payment.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { processPaymentSchema } from './payment.schema.js';

const router = Router();

// Payment processing requires authentication
router.post('/process', authenticate, validate(processPaymentSchema), paymentController.processPayment);

export default router;
