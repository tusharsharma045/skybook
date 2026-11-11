import crypto from 'crypto';
import { prisma } from '../../config/db.js';
import { flightProvider } from '../../services/flightProvider/FlightProviderFactory.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildTicketPdf } from './ticketPdf.service.js';

// Generate 6-char random alphanumeric PNR locator
const generatePNR = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pnr = 'SKY-';
  for (let i = 0; i < 6; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
};

export const createBooking = async (userId, data) => {
  const {
    offerId,
    passengers,
    contactEmail,
    contactPhone,
    notes,
    savePassengersToProfile = false,
  } = data;

  // 1. Fetch flight offer details
  const offer = await flightProvider.getOffer(offerId);
  if (!offer) {
    throw ApiError.badRequest('Selected flight offer has expired. Please run a new search.');
  }

  // 2. Generate unique booking reference
  let bookingReference = generatePNR();
  let existing = await prisma.booking.findUnique({ where: { bookingReference } });
  while (existing) {
    bookingReference = generatePNR();
    existing = await prisma.booking.findUnique({ where: { bookingReference } });
  }

  // 3. Prepare segments from offer slices
  const segmentsData = [];
  let segOrder = 0;

  offer.slices.forEach((slice, sIdx) => {
    const isReturn = sIdx > 0;
    slice.segments.forEach((seg) => {
      segmentsData.push({
        segmentOrder: segOrder++,
        isReturn,
        originAirport: seg.origin.code,
        originCity: seg.origin.city || seg.origin.name,
        originTerminal: seg.origin.terminal || null,
        destinationAirport: seg.destination.code,
        destinationCity: seg.destination.city || seg.destination.name,
        destinationTerminal: seg.destination.terminal || null,
        departureTime: new Date(seg.departureTime),
        arrivalTime: new Date(seg.arrivalTime),
        carrierCode: seg.carrier.code,
        carrierName: seg.carrier.name,
        flightNumber: seg.flightNumber,
        aircraft: seg.aircraft.name,
        cabinClass: offer.cabinClass,
        durationMinutes: seg.durationMinutes,
        layoverMinutes: seg.layoverMinutes || null,
      });
    });
  });

  // 4. Create Booking & Passengers in Prisma transaction
  const booking = await prisma.$transaction(async (tx) => {
    const createdBooking = await tx.booking.create({
      data: {
        bookingReference,
        userId,
        status: 'PENDING',
        totalAmount: parseFloat(offer.totalAmount),
        currency: offer.totalCurrency || 'INR',
        duffelOfferId: offer.id,
        contactEmail,
        contactPhone: contactPhone || null,
        notes: notes || null,
        passengers: {
          create: passengers.map((p, pIdx) => ({
            type: p.type || 'ADULT',
            title: p.title || 'Mr',
            firstName: p.firstName,
            lastName: p.lastName,
            dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : null,
            gender: p.gender || 'MALE',
            nationality: p.nationality || 'US',
            passportNumber: p.passportNumber || null,
            passportExpiry: p.passportExpiry ? new Date(p.passportExpiry) : null,
            seatNumber: p.seatNumber || `${12 + pIdx}${['A', 'B', 'C', 'D'][pIdx % 4]}`,
            baggageAllowance: p.baggageAllowance || '1 x 23kg check-in, 1 cabin bag',
          })),
        },
        segments: {
          create: segmentsData,
        },
      },
      include: {
        passengers: true,
        segments: true,
      },
    });

    // 5. If savePassengersToProfile, upsert to user's saved passengers
    if (savePassengersToProfile) {
      for (const p of passengers) {
        if (p.firstName && p.lastName) {
          await tx.passenger.create({
            data: {
              userId,
              type: p.type || 'ADULT',
              title: p.title || 'Mr',
              firstName: p.firstName,
              lastName: p.lastName,
              dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : null,
              gender: p.gender || 'MALE',
              nationality: p.nationality || 'US',
              passportNumber: p.passportNumber || null,
              passportExpiry: p.passportExpiry ? new Date(p.passportExpiry) : null,
            },
          });
        }
      }
    }

    return createdBooking;
  });

  return booking;
};

export const getUserBookings = async (userId) => {
  return await prisma.booking.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    include: {
      passengers: true,
      segments: {
        orderBy: { segmentOrder: 'asc' },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getBookingByReference = async (bookingReference, userId) => {
  const booking = await prisma.booking.findFirst({
    where: {
      bookingReference,
      userId,
      deletedAt: null,
    },
    include: {
      passengers: true,
      segments: {
        orderBy: { segmentOrder: 'asc' },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!booking) {
    throw ApiError.notFound(`Booking reference ${bookingReference} not found`);
  }

  return booking;
};

export const cancelBooking = async (bookingReference, userId, reason = '') => {
  const booking = await getBookingByReference(bookingReference, userId);

  if (booking.status === 'CANCELLED') {
    throw ApiError.badRequest('This booking is already cancelled');
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: 'CANCELLED',
      notes: reason ? `${booking.notes || ''} [Cancellation reason: ${reason}]`.trim() : booking.notes,
    },
    include: {
      passengers: true,
      segments: true,
      payments: true,
    },
  });

  return updatedBooking;
};

export const getBookingTicketPdf = async (bookingReference, userId) => {
  const booking = await getBookingByReference(bookingReference, userId);
  return await buildTicketPdf(booking);
};
