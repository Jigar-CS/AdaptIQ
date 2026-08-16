const authService = require('../services/authService');
const { success, created, error } = require('../utils/responseFormatter');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    return created(res, result, 'Registration successful');
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return success(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    return success(res, result, 'Token refreshed');
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  // Stateless: client discards tokens. Future: add refresh token blocklist.
  return success(res, {}, 'Logged out successfully');
};

const forgotPassword = (req, res) => {
  // Stub: full forgot-password flow (email verification, reset token) out of scope for MVP
  return error(res, { code: 'NOT_IMPLEMENTED' }, 'Forgot password feature not yet implemented', 501);
};

module.exports = { register, login, refresh, logout, forgotPassword };
