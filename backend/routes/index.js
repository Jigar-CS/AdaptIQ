const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const authRoutes    = require('./authRoutes');
const adminRoutes   = require('./adminRoutes');
const studentRoutes = require('./studentRoutes');

<<<<<<< HEAD
// Health check — pings DB to confirm connection
router.get('/health', async (req, res) => {
  try {
    await pool.execute('SELECT 1');
    res.json({ success: true, data: { status: 'ok', db: 'ok', timestamp: new Date().toISOString() } });
  } catch (err) {
    res.status(503).json({ success: false, data: { status: 'error', db: 'unreachable' }, message: err.message });
=======
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
>>>>>>> 1826be6 (Updated Phase 1 & 2)
  }
});

router.use('/auth',  authRoutes);
router.use('/admin', adminRoutes);
router.use('/',      studentRoutes);

module.exports = router;
