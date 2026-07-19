const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const authRoutes    = require('./authRoutes');
const adminRoutes   = require('./adminRoutes');
const studentRoutes = require('./studentRoutes');

// Health check — pings DB to confirm connection
router.get('/health', async (req, res) => {
  try {
    await pool.execute('SELECT 1');
    res.json({ success: true, data: { status: 'ok', db: 'ok', timestamp: new Date().toISOString() } });
  } catch (err) {
    res.status(503).json({ success: false, data: { status: 'error', db: 'unreachable' }, message: err.message });
  }
});

router.use('/auth',  authRoutes);
router.use('/admin', adminRoutes);
router.use('/',      studentRoutes);

module.exports = router;
