const { NODE_ENV } = require('../config/env');

/**
 * Global error handler — must be registered last in Express middleware chain.
 * Catches all errors thrown with next(err).
 */
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || 'SERVER_ERROR';
  const message = NODE_ENV === 'production' && status === 500
    ? 'Internal server error'
    : err.message || 'An unexpected error occurred';

  if (NODE_ENV !== 'production') {
    console.error(`[ERROR] ${req.method} ${req.path} →`, err);
  }

  return res.status(status).json({
    success: false,
    error: { code, message },
  });
};

module.exports = errorHandler;
