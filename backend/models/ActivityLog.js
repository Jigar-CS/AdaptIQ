const pool = require('../config/db');

const ActivityLog = {
  /**
   * Log an event or adaptive engine decision
   */
  log: async ({ user_id = null, action_type, details = null }) => {
    try {
      const detailsJson = details ? JSON.stringify(details) : null;
      await pool.execute(
        `INSERT INTO activity_logs (user_id, action_type, details)
         VALUES (?, ?, ?)`,
        [user_id, action_type, detailsJson]
      );
    } catch (err) {
      console.error('Failed to write to activity_logs:', err.message);
    }
  },

  /**
   * Get the most recent adaptive difficulty decision for a test session.
   * Returns the `new_difficulty` computed by the last evaluateBatch() call,
   * or null if no evaluation has happened yet for this test.
   */
  getLatestDifficultyDecision: async (test_id) => {
    const [rows] = await pool.execute(
      `SELECT details FROM activity_logs
       WHERE action_type = 'ADAPTIVE_DIFFICULTY_EVALUATION'
         AND JSON_EXTRACT(details, '$.test_id') = ?
       ORDER BY id DESC
       LIMIT 1`,
      [test_id]
    );
    if (!rows[0]) return null;
    const details = typeof rows[0].details === 'string' ? JSON.parse(rows[0].details) : rows[0].details;
    return details?.new_difficulty || null;
  },
};

module.exports = ActivityLog;
