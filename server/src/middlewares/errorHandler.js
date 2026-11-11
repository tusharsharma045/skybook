import { ApiError } from '../utils/ApiError.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors || [], error.isOperational || false, error.stack);
  }

  const { statusCode, message, errors } = error;

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${message}`, error.stack);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${statusCode} - ${message}`);
  }

  const response = {
    success: false,
    message,
    ...(errors && errors.length > 0 && { errors }),
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(statusCode).json(response);
};
