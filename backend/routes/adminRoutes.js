const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const topicController = require('../controllers/topicController');

// --- Topics (Admin) ---
router.post('/topics',     authenticate, authorize('admin'), topicController.createTopic);
router.put('/topics/:id',  authenticate, authorize('admin'), topicController.updateTopic);
router.delete('/topics/:id', authenticate, authorize('admin'), topicController.deleteTopic);

// Placeholder routes — to be implemented in future phases
router.get('/users',             authenticate, authorize('admin'), (req, res) => res.json({ success: true, data: { users: [] }, message: 'Not yet implemented' }));
router.get('/questions',         authenticate, authorize('admin'), (req, res) => res.json({ success: true, data: { questions: [] }, message: 'Not yet implemented' }));
router.post('/questions/import', authenticate, authorize('admin'), (req, res) => res.json({ success: true, data: {}, message: 'CSV import not yet implemented' }));
router.get('/analytics/overview',authenticate, authorize('admin'), (req, res) => res.json({ success: true, data: {}, message: 'Not yet implemented' }));
router.get('/activity-logs',     authenticate, authorize('admin'), (req, res) => res.json({ success: true, data: { logs: [] }, message: 'Not yet implemented' }));

module.exports = router;
