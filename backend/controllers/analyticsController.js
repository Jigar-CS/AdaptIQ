const pool = require('../config/db');
const { success } = require('../utils/responseFormatter');

/**
 * GET /admin/analytics/overview
 * Returns: total users (students), total questions, platform avg accuracy
 */
const getOverview = async (req, res, next) => {
  try {
    const [[userRow]] = await pool.execute(
      `SELECT COUNT(*) AS total_users FROM users WHERE role = 'student' AND is_active = TRUE`
    );

    const [[qRow]] = await pool.execute(
      `SELECT COUNT(*) AS total_questions FROM questions WHERE is_active = TRUE`
    );

    // avg accuracy across all user_answers (if table exists and has data)
    let avg_accuracy = null;
    try {
      const [[accRow]] = await pool.execute(
        `SELECT ROUND(AVG(is_correct) * 100, 1) AS avg_accuracy FROM user_answers`
      );
      avg_accuracy = accRow?.avg_accuracy ?? null;
    } catch {
      // user_answers table may not exist yet (pre-Phase 7) — return null gracefully
    }

    return success(res, {
      total_users: userRow.total_users,
      total_questions: qRow.total_questions,
      avg_accuracy,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /admin/analytics/topic-difficulty
 * Returns per-topic question counts broken down by Easy / Medium / Hard.
 * Shape: [{ topic_name, easy_count, medium_count, hard_count }, ...]
 */
const getTopicDifficultyBreakdown = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        t.name AS topic_name,
        SUM(q.difficulty = 'Easy')   AS easy_count,
        SUM(q.difficulty = 'Medium') AS medium_count,
        SUM(q.difficulty = 'Hard')   AS hard_count
      FROM topics t
      LEFT JOIN questions q ON q.topic_id = t.id AND q.is_active = TRUE
      WHERE t.is_active = TRUE
      GROUP BY t.id, t.name
      ORDER BY t.name ASC
    `);

    // Coerce SUM nulls (from LEFT JOIN when no questions) to 0
    const breakdown = rows.map((r) => ({
      topic_name:    r.topic_name,
      easy_count:   Number(r.easy_count   ?? 0),
      medium_count: Number(r.medium_count ?? 0),
      hard_count:   Number(r.hard_count   ?? 0),
    }));

    return success(res, breakdown);
  } catch (err) {
    next(err);
  }
};

module.exports = { getOverview, getTopicDifficultyBreakdown };
