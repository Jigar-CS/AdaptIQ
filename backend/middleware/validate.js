const { validationResult } = require('express-validator');
const { validationError } = require('../utils/responseFormatter');

/**
 * Runs after express-validator checks.
 * If errors exist, returns 400 with all field errors.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return validationError(res, 'Validation failed', details);
  }
  next();
};

module.exports = validate;
