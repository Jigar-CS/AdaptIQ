const express = require('express');
<<<<<<< HEAD
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const userController = require('../controllers/userController');
const topicController = require('../controllers/topicController');

// Profile
router.get('/profile',     authenticate, userController.getProfile);
router.put('/profile',     authenticate, userController.updateProfile);
=======
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { body } = require('express-validator');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const profileGate = require('../middleware/profileGate');
const validate = require('../middleware/validate');
const userController = require('../controllers/userController');
const topicController = require('../controllers/topicController');
const { UPLOAD_DIR, MAX_PHOTO_SIZE, MAX_RESUME_SIZE } = require('../config/env');

const uploadDir = path.join(__dirname, '..', UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const photoUpload = multer({
  storage,
  limits: { fileSize: MAX_PHOTO_SIZE },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, and WEBP images are allowed'));
    }
    cb(null, true);
  },
}).single('photo');

const resumeUpload = multer({
  storage,
  limits: { fileSize: MAX_RESUME_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF resumes are allowed'));
    }
    cb(null, true);
  },
}).single('resume');

const profileRules = [
  body('name').optional().trim().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().trim().notEmpty().withMessage('Phone is required'),
  body('college').optional().trim().notEmpty().withMessage('College is required'),
  body('branch').optional().trim().notEmpty().withMessage('Branch is required'),
  body('graduation_year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 10 })
    .withMessage('Graduation year is required'),
  body('cgpa')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('CGPA must be between 0 and 10'),
  body('linkedin_url')
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage('LinkedIn URL must be valid'),
];

const passwordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters'),
];

// Profile
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, profileRules, validate, userController.updateProfile);
router.put('/profile/password', authenticate, passwordRules, validate, userController.updatePassword);
router.post('/profile/photo', authenticate, (req, res, next) => photoUpload(req, res, (err) => {
  if (err) {
    err.status = 400;
    err.code = 'INVALID_PHOTO_UPLOAD';
    return next(err);
  }
  next();
}), userController.uploadProfilePhoto);
router.post('/profile/resume', authenticate, (req, res, next) => resumeUpload(req, res, (err) => {
  if (err) {
    err.status = 400;
    err.code = 'INVALID_RESUME_UPLOAD';
    return next(err);
  }
  next();
}), userController.uploadResume);
>>>>>>> 1826be6 (Updated Phase 1 & 2)

// Topics (shared Student + Admin read)
router.get('/topics', authenticate, topicController.getAllTopics);

// Placeholder routes — to be implemented in future phases
const stub = (msg) => (req, res) => res.json({ success: true, data: {}, message: msg });

router.post('/practice/start',               authenticate, stub('Practice not yet implemented'));
router.post('/practice/:testId/answer',      authenticate, stub('Practice not yet implemented'));
router.post('/practice/:testId/complete',    authenticate, stub('Practice not yet implemented'));

<<<<<<< HEAD
router.post('/adaptive/start',               authenticate, stub('Adaptive engine not yet implemented'));
=======
router.post('/adaptive/start',               authenticate, profileGate, stub('Adaptive engine not yet implemented'));
>>>>>>> 1826be6 (Updated Phase 1 & 2)
router.get('/adaptive/:testId/next-batch',   authenticate, stub('Adaptive engine not yet implemented'));
router.post('/adaptive/:testId/answer',      authenticate, stub('Adaptive engine not yet implemented'));
router.get('/adaptive/:testId/status',       authenticate, stub('Adaptive engine not yet implemented'));
router.post('/adaptive/:testId/complete',    authenticate, stub('Adaptive engine not yet implemented'));

router.get('/placement-score',               authenticate, stub('Placement score not yet implemented'));
router.get('/placement-score/history',       authenticate, stub('Placement score not yet implemented'));

router.get('/company-tests',                 authenticate, stub('Company tests not yet implemented'));
router.post('/company-tests/:id/start',      authenticate, stub('Company tests not yet implemented'));

router.get('/performance/summary',           authenticate, stub('Analytics not yet implemented'));
router.get('/performance/by-topic',          authenticate, stub('Analytics not yet implemented'));
router.get('/performance/history',           authenticate, stub('Analytics not yet implemented'));

router.get('/recommendations',               authenticate, stub('Recommendations not yet implemented'));

module.exports = router;
