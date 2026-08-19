const pool = require('../config/db');

const PlacementScore = {
  /**
   * Save a new placement score snapshot (history is preserved, not overwritten)
   */
  save: async ({ user_id, score, accuracy_component, speed_component, difficulty_mastery_component }) => {
    const [result] = await pool.execute(
      `INSERT INTO placement_score 
       (user_id, score, accuracy_component, speed_component, difficulty_mastery_component)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, score, accuracy_component, speed_component, difficulty_mastery_component]
    );
    return result.insertId;
  },

  /**
   * Get the latest placement score for a user
   */
  getLatest: async (user_id) => {
    const [rows] = await pool.execute(
      `SELECT id, user_id, score, accuracy_component, speed_component, 
              difficulty_mastery_component, calculated_at
       FROM placement_score
       WHERE user_id = ?
       ORDER BY calculated_at DESC
       LIMIT 1`,
      [user_id]
    );
    return rows[0] || null;
  },

  /**
   * Get full placement score history for a user (for trend chart)
   */
  getHistory: async (user_id) => {
    const [rows] = await pool.execute(
      `SELECT id, score, accuracy_component, speed_component, 
              difficulty_mastery_component, calculated_at
       FROM placement_score
       WHERE user_id = ?
       ORDER BY calculated_at ASC`,
      [user_id]
    );
    return rows;
  },

  /**
   * Get user's global rank based on latest placement score
   */
  getGlobalRank: async (user_id) => {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) + 1 AS rank_position
       FROM (
         SELECT user_id, MAX(score) AS best_score
         FROM placement_score
         GROUP BY user_id
       ) ranked
       WHERE ranked.best_score > (
         SELECT COALESCE(MAX(score), 0)
         FROM placement_score
         WHERE user_id = ?
       )`,
      [user_id]
    );
    return rows[0]?.rank_position || null;
  },
};

module.exports = PlacementScore;
