const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const { body } = require('express-validator');

const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const topicController = require('../controllers/topicController');
const questionController = require('../controllers/questionController');
const { UPLOAD_DIR } = require('../config/env');

const uploadDir = path.join(__dirname, '..', UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage for CSV imports
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.csv';
    cb(null, `csv_import_${crypto.randomUUID()}${ext}`);
  },
});

const csvUpload = multer({
  storage: csvStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.csv' && file.mimetype !== 'text/csv' && file.mimetype !== 'application/vnd.ms-excel') {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  },
}).single('file');

// Question validation rules
const questionRules = [
  body('topic_id').isInt({ min: 1 }).withMessage('Valid topic is required'),
  body('question_text').trim().notEmpty().withMessage('Question text is required'),
  body('option_a').trim().notEmpty().withMessage('Option A is required'),
  body('option_b').trim().notEmpty().withMessage('Option B is required'),
  body('option_c').trim().notEmpty().withMessage('Option C is required'),
  body('option_d').trim().notEmpty().withMessage('Option D is required'),
  body('correct_option')
    .toUpperCase()
    .isIn(['A', 'B', 'C', 'D'])
    .withMessage('Correct option must be A, B, C, or D'),
  body('difficulty')
    .isIn(['Easy', 'Medium', 'Hard', 'easy', 'medium', 'hard'])
    .withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('explanation').optional().trim(),
];

const questionUpdateRules = [
  body('topic_id').optional().isInt({ min: 1 }).withMessage('Valid topic ID required'),
  body('question_text').optional().trim().notEmpty().withMessage('Question text cannot be empty'),
  body('option_a').optional().trim().notEmpty().withMessage('Option A cannot be empty'),
  body('option_b').optional().trim().notEmpty().withMessage('Option B cannot be empty'),
  body('option_c').optional().trim().notEmpty().withMessage('Option C cannot be empty'),
  body('option_d').optional().trim().notEmpty().withMessage('Option D cannot be empty'),
  body('correct_option')
    .optional()
    .toUpperCase()
    .isIn(['A', 'B', 'C', 'D'])
    .withMessage('Correct option must be A, B, C, or D'),
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard', 'easy', 'medium', 'hard'])
    .withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('explanation').optional().trim(),
];

// --- Topics (Admin) ---
router.post('/topics', authenticate, authorize('admin'), topicController.createTopic);
router.put('/topics/:id', authenticate, authorize('admin'), topicController.updateTopic);
router.delete('/topics/:id', authenticate, authorize('admin'), topicController.deleteTopic);

// --- Question Bank Management (Admin) ---
router.get('/questions', authenticate, authorize('admin'), questionController.getAllQuestions);
router.get('/questions/:id', authenticate, authorize('admin'), questionController.getQuestionById);
router.post('/questions', authenticate, authorize('admin'), questionRules, validate, questionController.createQuestion);
router.put('/questions/:id', authenticate, authorize('admin'), questionUpdateRules, validate, questionController.updateQuestion);
router.delete('/questions/:id', authenticate, authorize('admin'), questionController.deleteQuestion);

// --- CSV Batch Import ---
router.post(
  '/questions/import',
  authenticate,
  authorize('admin'),
  (req, res, next) => {
    csvUpload(req, res, (err) => {
      if (err) {
        err.status = 400;
        err.code = 'INVALID_CSV_UPLOAD';
        return next(err);
      }
      next();
    });
  },
  questionController.importCsv
);

// Stub routes for remaining admin features (Phases 6 & 11)
router.get('/users', authenticate, authorize('admin'), (req, res) => res.json({ success: true, data: { users: [] }, message: 'Not yet implemented' }));
router.get('/analytics/overview', authenticate, authorize('admin'), (req, res) => res.json({ success: true, data: {}, message: 'Not yet implemented' }));
router.get('/activity-logs', authenticate, authorize('admin'), (req, res) => res.json({ success: true, data: { logs: [] }, message: 'Not yet implemented' }));

module.exports = router;
