import bcrypt from 'bcryptjs';
import { prisma } from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';

export const updateProfile = async (userId, data) => {
  const { firstName, lastName, phone } = data;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim() || null,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  return updatedUser;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { message: 'Password updated successfully' };
};

export const getSavedPassengers = async (userId) => {
  return await prisma.passenger.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const createSavedPassenger = async (userId, data) => {
  return await prisma.passenger.create({
    data: {
      userId,
      type: data.type || 'ADULT',
      title: data.title || 'Mr',
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      gender: data.gender || 'MALE',
      nationality: data.nationality || 'US',
      passportNumber: data.passportNumber?.trim() || null,
      passportExpiry: data.passportExpiry ? new Date(data.passportExpiry) : null,
    },
  });
};

export const updateSavedPassenger = async (passengerId, userId, data) => {
  const passenger = await prisma.passenger.findFirst({
    where: { id: passengerId, userId, deletedAt: null },
  });

  if (!passenger) {
    throw ApiError.notFound('Saved passenger not found');
  }

  return await prisma.passenger.update({
    where: { id: passengerId },
    data: {
      type: data.type || passenger.type,
      title: data.title || passenger.title,
      firstName: data.firstName ? data.firstName.trim() : passenger.firstName,
      lastName: data.lastName ? data.lastName.trim() : passenger.lastName,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : passenger.dateOfBirth,
      gender: data.gender || passenger.gender,
      nationality: data.nationality || passenger.nationality,
      passportNumber: data.passportNumber !== undefined ? (data.passportNumber?.trim() || null) : passenger.passportNumber,
      passportExpiry: data.passportExpiry ? new Date(data.passportExpiry) : passenger.passportExpiry,
    },
  });
};

export const deleteSavedPassenger = async (passengerId, userId) => {
  const passenger = await prisma.passenger.findFirst({
    where: { id: passengerId, userId, deletedAt: null },
  });

  if (!passenger) {
    throw ApiError.notFound('Saved passenger not found');
  }

  await prisma.passenger.update({
    where: { id: passengerId },
    data: { deletedAt: new Date() },
  });

  return { message: 'Passenger removed successfully' };
};
