const { forbidden } = require('../utils/responseFormatter');

/**
 * Middleware factory: restricts access to users with a specific role.
 * Usage: router.get('/admin/users', authenticate, authorize('admin'), handler)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return forbidden(res, 'You do not have permission to access this resource');
    }
    next();
  };
};

module.exports = authorize;
