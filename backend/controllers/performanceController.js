const pool = require('../config/db');
const Performance = require('../models/Performance');
const Recommendation = require('../models/Recommendation');

const performanceController = {
  /**
   * GET /performance/summary
   * Overall stats: total attempts, accuracy, avg response time across all topics.
   */
  getSummary: async (req, res, next) => {
    try {
      const data = await Performance.getSummary(req.user.id);
      return res.json({
        success: true,
        data: {
          total_attempted:  Number(data.total_attempted  ?? 0),
          total_correct:    Number(data.total_correct    ?? 0),
          accuracy_percent: Number(data.accuracy_percent ?? 0),
          avg_response_time: Number(data.avg_response_time ?? 0),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /performance/by-topic
   * Per-topic accuracy and speed breakdown.
   */
  getByTopic: async (req, res, next) => {
    try {
      const topics = await Performance.getByTopic(req.user.id);
      return res.json({ success: true, data: { topics } });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /performance/history
   * Completed test history with scores for trend chart.
   * Returns the last N tests ordered by date.
   */
  getHistory: async (req, res, next) => {
    try {
      const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
      const [rows] = await pool.execute(
        `SELECT
           t.id          AS test_id,
           t.test_type,
           t.topic_id,
           top.name      AS topic_name,
           t.started_at,
           t.completed_at,
           COUNT(ua.id)                                           AS total_answered,
           SUM(ua.is_correct)                                     AS total_correct,
           ROUND(SUM(ua.is_correct) / NULLIF(COUNT(ua.id),0) * 100, 1) AS accuracy_percent,
           ROUND(AVG(ua.response_time_seconds), 1)               AS avg_response_time
         FROM tests t
         LEFT JOIN topics top ON top.id = t.topic_id
         LEFT JOIN user_answers ua ON ua.test_id = t.id
         WHERE t.user_id = ? AND t.status = 'completed'
         GROUP BY t.id
         ORDER BY t.completed_at DESC
         LIMIT ?`,
        [req.user.id, limit]
      );

      // Shape for chart: date label + accuracy
      const history = rows.map((r) => ({
        test_id: r.test_id,
        test_type: r.test_type,
        topic_name: r.topic_name,
        total_answered: Number(r.total_answered ?? 0),
        total_correct: Number(r.total_correct ?? 0),
        accuracy_percent: Number(r.accuracy_percent ?? 0),
        avg_response_time: Number(r.avg_response_time ?? 0),
        date: r.completed_at
          ? new Date(r.completed_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
          : null,
        score: Number(r.accuracy_percent ?? 0),
        completed_at: r.completed_at,
        started_at: r.started_at,
      })).reverse(); // oldest first for chart

      return res.json({ success: true, data: { history } });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /recommendations
   * Active rule-based recommendations for the student.
   */
  getRecommendations: async (req, res, next) => {
    try {
      const recommendations = await Recommendation.getForUser(req.user.id);
      return res.json({ success: true, data: { recommendations } });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /recommendations/:id/dismiss
   */
  dismissRecommendation: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      await Recommendation.dismiss(id, req.user.id);
      return res.json({ success: true, data: { dismissed: true } });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = performanceController;
