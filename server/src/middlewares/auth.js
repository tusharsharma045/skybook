import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { prisma } from '../config/db.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(ApiError.unauthorized('Authentication token is required'));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(ApiError.unauthorized('Access token has expired'));
      }
      return next(ApiError.unauthorized('Invalid access token'));
    }

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
      },
    });

    if (!user) {
      return next(ApiError.unauthorized('User not found or account deactivated'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuthenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
      const user = await prisma.user.findFirst({
        where: { id: decoded.userId, deletedAt: null },
        select: { id: true, email: true, firstName: true, lastName: true, role: true },
      });
      if (user) {
        req.user = user;
      }
    } catch (e) {
      // Ignore token expiry / invalid in optional mode
    }

    next();
  } catch (error) {
    next();
  }
};
