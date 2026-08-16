const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { UPLOAD_DIR, MAX_PHOTO_SIZE } = require('../config/env');

// Create photos directory if it doesn't exist
const photosDir = path.join(__dirname, '..', UPLOAD_DIR, 'photos');
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true });
}

// Configure storage for profile photos
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, photosDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${ext}`;
    cb(null, filename);
  },
});

// File filter for photos (only images)
const photoFileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  }
};

const uploadPhotoMiddleware = multer({
  storage: photoStorage,
  fileFilter: photoFileFilter,
  limits: { fileSize: MAX_PHOTO_SIZE || 5 * 1024 * 1024 }, // 5MB default
});

module.exports = uploadPhotoMiddleware;
