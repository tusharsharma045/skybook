import { PrismaClient, UserRole, BookingStatus, PaymentStatus, PassengerType, Gender, CabinClass } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SkyBook database seeding...');

  // Clean up any old admin user
  await prisma.user.deleteMany({
    where: { email: 'admin@skybook.com' },
  });

  // 1. Password hash
  const userPassword = await bcrypt.hash('Password@123', 10);

  // 2. Demo Customer Traveler
  const user = await prisma.user.upsert({
    where: { email: 'alex@skybook.com' },
    update: {
      firstName: 'Tushar',
      lastName: 'Sharma',
      phone: '+91 98765 43210',
    },
    create: {
      email: 'alex@skybook.com',
      passwordHash: userPassword,
      firstName: 'Tushar',
      lastName: 'Sharma',
      phone: '+91 98765 43210',
      role: UserRole.USER,
      isEmailVerified: true,
    },
  });
  console.log(`✅ Demo user seeded: ${user.email}`);

  // 4. Saved Passengers for Demo User
  await prisma.passenger.deleteMany({
    where: { userId: user.id },
  });

  const p1 = await prisma.passenger.create({
    data: {
      userId: user.id,
      type: PassengerType.ADULT,
      title: 'Mr',
      firstName: 'Tushar',
      lastName: 'Sharma',
      dateOfBirth: new Date('2000-01-15'),
      gender: Gender.MALE,
      nationality: 'IN',
      passportNumber: 'Z1234567',
      passportExpiry: new Date('2032-10-20'),
    },
  });

  const p2 = await prisma.passenger.create({
    data: {
      userId: user.id,
      type: PassengerType.ADULT,
      title: 'Mrs',
      firstName: 'Pooja',
      lastName: 'Sharma',
      dateOfBirth: new Date('2002-05-20'),
      gender: Gender.FEMALE,
      nationality: 'IN',
      passportNumber: 'Z7654321',
      passportExpiry: new Date('2031-04-12'),
    },
  });
  console.log(`✅ Saved passengers seeded for: ${user.email}`);

  // 5. Initial Sample Booking (Upcoming flight from DEL to BOM)
  const existingBooking = await prisma.booking.findUnique({
    where: { bookingReference: 'SKY-DEL-BOM-01' },
  });

  if (!existingBooking) {
    const booking = await prisma.booking.create({
      data: {
        bookingReference: 'SKY-DEL-BOM-01',
        userId: user.id,
        status: BookingStatus.CONFIRMED,
        totalAmount: 7300.00,
        currency: 'INR',
        contactEmail: 'alex@skybook.com',
        contactPhone: '+91 98765 43210',
        notes: 'Vegetarian meal requested, window seat 12A',
        passengers: {
          create: [
            {
              type: PassengerType.ADULT,
              title: 'Mr',
              firstName: 'Tushar',
              lastName: 'Sharma',
              dateOfBirth: new Date('2000-01-15'),
              gender: Gender.MALE,
              nationality: 'IN',
              passportNumber: 'Z1234567',
              passportExpiry: new Date('2032-10-20'),
              seatNumber: '12A',
              baggageAllowance: '15kg check-in, 7kg cabin',
            },
            {
              type: PassengerType.ADULT,
              title: 'Mrs',
              firstName: 'Pooja',
              lastName: 'Sharma',
              dateOfBirth: new Date('2002-05-20'),
              gender: Gender.FEMALE,
              nationality: 'IN',
              passportNumber: 'Z7654321',
              passportExpiry: new Date('2031-04-12'),
              seatNumber: '12B',
              baggageAllowance: '15kg check-in, 7kg cabin',
            },
          ],
        },
        segments: {
          create: [
            {
              segmentOrder: 0,
              isReturn: false,
              originAirport: 'DEL',
              originCity: 'New Delhi',
              originTerminal: 'T3',
              destinationAirport: 'BOM',
              destinationCity: 'Mumbai',
              destinationTerminal: 'T2',
              departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
              arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 60 * 2.2),
              carrierCode: '6E',
              carrierName: 'IndiGo',
              flightNumber: '6E 2041',
              aircraft: 'Airbus A320neo',
              cabinClass: CabinClass.ECONOMY,
              durationMinutes: 130,
            },
          ],
        },
        payments: {
          create: [
            {
              transactionId: 'txn_mock_skybook_inr_9981',
              provider: 'STRIPE',
              status: PaymentStatus.COMPLETED,
              amount: 7300.00,
              currency: 'INR',
              paymentMethod: 'UPI / Card •••• 4242',
              receiptUrl: 'https://skybook.travel/receipts/SKY-DEL-BOM-01',
            },
          ],
        },
      },
    });
    console.log(`✅ Sample confirmed booking created: ${booking.bookingReference}`);
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
