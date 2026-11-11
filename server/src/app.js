import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { ApiError } from './utils/ApiError.js';
import { sendSuccess } from './utils/response.js';
import authRouter from './modules/auth/auth.routes.js';
import flightRouter from './modules/flights/flight.routes.js';
import bookingRouter from './modules/bookings/booking.routes.js';
import paymentRouter from './modules/payments/payment.routes.js';
import userRouter from './modules/users/user.routes.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parsers
app.use(cookieParser(env.COOKIE_SECRET));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// Rate Limiting
app.use('/api', generalLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  return sendSuccess(res, 200, 'SkyBook API is operational', {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API Route Modules
app.use('/api/auth', authRouter);
app.use('/api/flights', flightRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/users', userRouter);
// app.use('/api/flights', flightRouter);
// app.use('/api/bookings', bookingRouter);
// app.use('/api/payments', paymentRouter);
// app.use('/api/users', userRouter);

// 404 Handler
app.use('*', (req, res, next) => {
  next(ApiError.notFound(`Endpoint ${req.originalUrl} not found`));
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
