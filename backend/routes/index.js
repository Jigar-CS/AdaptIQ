const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const authRoutes    = require('./authRoutes');
const adminRoutes   = require('./adminRoutes');
const studentRoutes = require('./studentRoutes');

// Health check — pings the DB connection pool
router.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1 AS ok');
    const dbOk = rows && rows[0]?.ok === 1;
    res.json({
      success: true,
      data: {
        status: 'ok',
        db: dbOk ? 'ok' : 'error',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      data: {
        status: 'degraded',
        db: 'error',
        timestamp: new Date().toISOString(),
      },
      error: { code: 'DB_UNAVAILABLE', message: err.message },
    });
  }
});

router.use('/auth',  authRoutes);
router.use('/admin', adminRoutes);
router.use('/',      studentRoutes);

module.exports = router;
