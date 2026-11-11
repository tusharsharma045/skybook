import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  try {
    const validData = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (validData.body) req.body = validData.body;
    if (validData.query) req.query = validData.query;
    if (validData.params) req.params = validData.params;

    next();
  } catch (error) {
    if (error.errors) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.').replace(/^(body|query|params)\./, ''),
        message: err.message,
      }));
      return next(ApiError.badRequest('Validation Error', formattedErrors));
    }
    next(error);
  }
};
