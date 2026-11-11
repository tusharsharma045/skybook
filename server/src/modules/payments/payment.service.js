import crypto from 'crypto';
import { prisma } from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import { env } from '../../config/env.js';

export const processBookingPayment = async (userId, data) => {
  const { bookingId, paymentMethod, cardNumber, cardholderName } = data;

  // 1. Fetch booking
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
      deletedAt: null,
    },
    include: {
      passengers: true,
      segments: true,
    },
  });

  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }

  if (booking.status === 'CONFIRMED') {
    throw ApiError.badRequest('This booking is already paid and confirmed');
  }

  if (booking.status === 'CANCELLED') {
    throw ApiError.badRequest('Cannot process payment for a cancelled booking');
  }

  // 2. Generate unique transaction reference
  const transactionId = `txn_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
  const last4 = cardNumber ? cardNumber.slice(-4) : '4242';
  const methodLabel = `${paymentMethod === 'CARD' ? 'Visa' : paymentMethod} •••• ${last4}`;

  // 3. Process payment in transaction
  const result = await prisma.$transaction(async (tx) => {
    // Record payment
    const payment = await tx.payment.create({
      data: {
        bookingId: booking.id,
        transactionId,
        provider: env.STRIPE_SECRET_KEY ? 'STRIPE' : 'MOCK',
        status: 'COMPLETED',
        amount: booking.totalAmount,
        currency: booking.currency,
        paymentMethod: methodLabel,
        receiptUrl: `https://skybook.travel/receipts/${booking.bookingReference}`,
      },
    });

    // Update booking status
    const confirmedBooking = await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: 'CONFIRMED',
      },
      include: {
        passengers: true,
        segments: {
          orderBy: { segmentOrder: 'asc' },
        },
        payments: true,
      },
    });

    return { payment, booking: confirmedBooking };
  });

  return result;
};
