/**
 * Consistent response envelope for all API endpoints.
 * Success:  { success: true,  data: ..., message: '' }
 * Error:    { success: false, error: { code, message } }
 */

const success = (res, data = {}, message = '', status = 200) => {
  return res.status(status).json({ success: true, data, message });
};

const created = (res, data = {}, message = 'Created successfully') => {
  return res.status(201).json({ success: true, data, message });
};

const error = (res, code = 'SERVER_ERROR', message = 'An error occurred', status = 500) => {
  return res.status(status).json({ success: false, error: { code, message } });
};

const validationError = (res, message = 'Validation failed', details = []) => {
  return res.status(400).json({
    success: false,
    error: { code: 'VALIDATION_ERROR', message, details },
  });
};

const notFound = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message },
  });
};

const unauthorized = (res, message = 'Authentication required') => {
  return res.status(401).json({
    success: false,
    error: { code: 'UNAUTHORIZED', message },
  });
};

const forbidden = (res, message = 'Access denied') => {
  return res.status(403).json({
    success: false,
    error: { code: 'FORBIDDEN', message },
  });
};

module.exports = { success, created, error, validationError, notFound, unauthorized, forbidden };
