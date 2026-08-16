const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const userController = require('../controllers/userController');
const uploadPhotoMiddleware = require('../middleware/uploadPhotoMiddleware');
const uploadResumeMiddleware = require('../middleware/uploadResumeMiddleware');

// All routes require authentication
router.use(authenticate);

// Get current user's profile
router.get('/profile', userController.getProfile);

// Update profile fields
const updateProfileRules = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').optional().trim().notEmpty().withMessage('Phone is required'),
  body('college').optional().trim().notEmpty().withMessage('College is required'),
  body('branch').optional().trim().notEmpty().withMessage('Branch is required'),
  body('graduation_year').optional().isInt().withMessage('Valid year required'),
  body('cgpa').optional().isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0-10'),
  body('linkedin_url').optional({ checkFalsy: true }).isURL().withMessage('Valid URL required'),
];
router.put('/profile', updateProfileRules, validate, userController.updateProfile);

// Update password
const updatePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
];
router.put('/profile/password', updatePasswordRules, validate, userController.updatePassword);

// Upload profile photo
router.post('/profile/photo', uploadPhotoMiddleware.single('photo'), userController.uploadProfilePhoto);

// Upload resume
router.post('/profile/resume', uploadResumeMiddleware.single('resume'), userController.uploadResume);

module.exports = router;
