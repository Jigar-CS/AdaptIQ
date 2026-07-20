require('dotenv').config();

const required = [
  'DB_HOST', 'DB_USER', 'DB_NAME',
  'JWT_SECRET', 'JWT_REFRESH_SECRET',
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

<<<<<<< HEAD
=======
  // Database
>>>>>>> 1826be6 (Updated Phase 1 & 2)
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 3306,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME,

<<<<<<< HEAD
=======
  // JWT
>>>>>>> 1826be6 (Updated Phase 1 & 2)
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
<<<<<<< HEAD
=======

  // App
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_PHOTO_SIZE: parseInt(process.env.MAX_PHOTO_SIZE, 10) || 5 * 1024 * 1024,  // 5MB
  MAX_RESUME_SIZE: parseInt(process.env.MAX_RESUME_SIZE, 10) || 10 * 1024 * 1024, // 10MB
>>>>>>> 1826be6 (Updated Phase 1 & 2)
};
