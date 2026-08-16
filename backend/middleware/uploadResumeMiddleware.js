const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { UPLOAD_DIR, MAX_RESUME_SIZE } = require('../config/env');

// Create resumes directory if it doesn't exist
const resumesDir = path.join(__dirname, '..', UPLOAD_DIR, 'resumes');
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}

// Configure storage for resumes
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumesDir);
  },
  filename: (req, file, cb) => {
    const filename = `${crypto.randomUUID()}.pdf`;
    cb(null, filename);
  },
});

// File filter for resumes (only PDF)
const resumeFileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for resumes'), false);
  }
};

const uploadResumeMiddleware = multer({
  storage: resumeStorage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: MAX_RESUME_SIZE || 10 * 1024 * 1024 }, // 10MB default
});

module.exports = uploadResumeMiddleware;
