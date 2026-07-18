const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const userController = require('../controllers/userController');
const topicController = require('../controllers/topicController');

// Profile
router.get('/profile',     authenticate, userController.getProfile);
router.put('/profile',     authenticate, userController.updateProfile);

// Topics (shared Student + Admin read)
router.get('/topics', authenticate, topicController.getAllTopics);

// Placeholder routes — to be implemented in future phases
const stub = (msg) => (req, res) => res.json({ success: true, data: {}, message: msg });

router.post('/practice/start',               authenticate, stub('Practice not yet implemented'));
router.post('/practice/:testId/answer',      authenticate, stub('Practice not yet implemented'));
router.post('/practice/:testId/complete',    authenticate, stub('Practice not yet implemented'));

router.post('/adaptive/start',               authenticate, stub('Adaptive engine not yet implemented'));
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
