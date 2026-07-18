const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const authenticate = require('../middleware/authenticate');
const authController = require('../controllers/authController');

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', authLimiter, registerRules, validate, authController.register);
router.post('/login',    authLimiter, loginRules,    validate, authController.login);
router.post('/refresh',  authController.refresh);
router.post('/logout',   authenticate, authController.logout);

module.exports = router;
