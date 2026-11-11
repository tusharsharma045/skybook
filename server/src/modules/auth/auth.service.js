import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../../config/db.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';

export const REFRESH_COOKIE_NAME = 'skybook_refresh_token';

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
});

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const generateTokens = async (userId) => {
  const accessToken = jwt.sign({ userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });

  const rawRefreshToken = crypto.randomBytes(40).toString('hex');
  const tokenHash = hashToken(rawRefreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return { accessToken, refreshToken: rawRefreshToken };
};

export const registerUser = async ({ email, password, firstName, lastName, phone }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await prisma.user.findFirst({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim() || null,
      role: 'USER',
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  const { accessToken, refreshToken } = await generateTokens(user.id);

  return { user, accessToken, refreshToken };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findFirst({
    where: {
      email: normalizedEmail,
      deletedAt: null,
    },
  });

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const { accessToken, refreshToken } = await generateTokens(user.id);

  const safeUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };

  return { user: safeUser, accessToken, refreshToken };
};

export const refreshTokens = async (rawRefreshToken) => {
  if (!rawRefreshToken) {
    throw ApiError.unauthorized('No refresh token provided');
  }

  const tokenHash = hashToken(rawRefreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!storedToken) {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  if (storedToken.revoked || storedToken.expiresAt < new Date()) {
    // If compromised, revoke all tokens for this user
    await prisma.refreshToken.updateMany({
      where: { userId: storedToken.userId },
      data: { revoked: true },
    });
    throw ApiError.unauthorized('Refresh token is expired or revoked. Please log in again.');
  }

  // Token rotation: Revoke used refresh token
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revoked: true },
  });

  // Issue new pair
  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(storedToken.userId);

  const safeUser = {
    id: storedToken.user.id,
    email: storedToken.user.email,
    firstName: storedToken.user.firstName,
    lastName: storedToken.user.lastName,
    phone: storedToken.user.phone,
    role: storedToken.user.role,
    avatarUrl: storedToken.user.avatarUrl,
  };

  return { user: safeUser, accessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (rawRefreshToken) => {
  if (rawRefreshToken) {
    const tokenHash = hashToken(rawRefreshToken);
    await prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revoked: true },
    });
  }
};

export const getCurrentUserProfile = async (userId) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
      savedPassengers: {
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return user;
};

export const requestPasswordReset = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findFirst({
    where: { email: normalizedEmail, deletedAt: null },
  });

  // In production, send email with reset token. Here, return stub success response.
  return {
    message: 'If an account exists with this email, password reset instructions have been sent.',
    previewCode: user ? 'SKY-8492' : undefined,
  };
};

export const resetPasswordWithCode = async ({ email, code, newPassword }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findFirst({
    where: { email: normalizedEmail, deletedAt: null },
  });

  if (!user) {
    throw ApiError.badRequest('Invalid or expired password reset request');
  }

  // Stub verification code verification (allows demo testing with code 'SKY-8492' or any 4+ char string)
  if (!code || code.length < 4) {
    throw ApiError.badRequest('Invalid verification code');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  // Revoke all existing sessions
  await prisma.refreshToken.updateMany({
    where: { userId: user.id },
    data: { revoked: true },
  });

  return { message: 'Password has been reset successfully. Please log in with your new password.' };
};
