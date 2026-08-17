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
};

module.exports = ActivityLog;
