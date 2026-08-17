const pool = require('../config/db');

const Recommendation = {
  /**
   * Insert a rule-based recommendation for a user.
   * Skips duplicates silently (same user + topic + type).
   */
  upsert: async ({ user_id, topic_id = null, message, recommendation_type }) => {
    // Avoid flooding: only create if no undismissed one of same type+topic exists
    const [existing] = await pool.execute(
      `SELECT id FROM recommendations
       WHERE user_id = ? AND topic_id <=> ? AND recommendation_type = ? AND is_dismissed = FALSE
       LIMIT 1`,
      [user_id, topic_id, recommendation_type]
    );
    if (existing.length > 0) return;

    await pool.execute(
      `INSERT INTO recommendations (user_id, topic_id, message, recommendation_type)
       VALUES (?, ?, ?, ?)`,
      [user_id, topic_id, message, recommendation_type]
    );
  },

  /**
   * Get all active (non-dismissed) recommendations for a user.
   */
  getForUser: async (user_id) => {
    const [rows] = await pool.execute(
      `SELECT r.id, r.topic_id, t.name AS topic_name, r.message, r.recommendation_type, r.created_at
       FROM recommendations r
       LEFT JOIN topics t ON t.id = r.topic_id
       WHERE r.user_id = ? AND r.is_dismissed = FALSE
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [user_id]
    );
    return rows;
  },

  /**
   * Dismiss a recommendation.
   */
  dismiss: async (id, user_id) => {
    await pool.execute(
      `UPDATE recommendations SET is_dismissed = TRUE WHERE id = ? AND user_id = ?`,
      [id, user_id]
    );
  },
};

module.exports = Recommendation;
