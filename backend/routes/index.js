const express = require('express');
const router = express.Router();

const authRoutes    = require('./authRoutes');
const adminRoutes   = require('./adminRoutes');
const studentRoutes = require('./studentRoutes');

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

router.use('/auth',  authRoutes);
router.use('/admin', adminRoutes);
router.use('/',      studentRoutes);

module.exports = router;
