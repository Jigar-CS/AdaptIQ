const pool = require('../config/db');

/**
 * Question Selection Engine (QSE)
 * Retrieves questions matching criteria using offset-based selection (no ORDER BY RAND()).
 */
const questionSelector = {
  getNextBatch: async ({
    topic_id = null,
    difficulty = 'Easy',
    exclude_ids = [],
    limit = 5,
  }) => {
    const conditions = ['is_active = TRUE'];
    const params = [];

    if (topic_id) {
      conditions.push('topic_id = ?');
      params.push(parseInt(topic_id, 10));
    }

    if (difficulty) {
      conditions.push('difficulty = ?');
      params.push(difficulty);
    }

    if (Array.isArray(exclude_ids) && exclude_ids.length > 0) {
      const validIds = exclude_ids.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
      if (validIds.length > 0) {
        const placeholders = validIds.map(() => '?').join(', ');
        conditions.push(`id NOT IN (${placeholders})`);
        params.push(...validIds);
      }
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    // 1. Get total count of available eligible questions
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM questions ${whereClause}`,
      params
    );
    let total = countRows[0]?.total || 0;

    // Fallback: If not enough questions at target difficulty, try without difficulty constraint but still excluding seen IDs
    if (total < limit) {
      const fallbackConditions = ['is_active = TRUE'];
      const fallbackParams = [];

      if (topic_id) {
        fallbackConditions.push('topic_id = ?');
        fallbackParams.push(parseInt(topic_id, 10));
      }

      if (Array.isArray(exclude_ids) && exclude_ids.length > 0) {
        const validIds = exclude_ids.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
        if (validIds.length > 0) {
          const placeholders = validIds.map(() => '?').join(', ');
          fallbackConditions.push(`id NOT IN (${placeholders})`);
          fallbackParams.push(...validIds);
        }
      }

      const fallbackWhere = `WHERE ${fallbackConditions.join(' AND ')}`;
      const [fbCountRows] = await pool.query(
        `SELECT COUNT(*) AS total FROM questions ${fallbackWhere}`,
        fallbackParams
      );
      const fbTotal = fbCountRows[0]?.total || 0;

      if (fbTotal > 0) {
        const offset = fbTotal > limit ? Math.floor(Math.random() * (fbTotal - limit + 1)) : 0;
        const [fbRows] = await pool.query(
          `SELECT id, topic_id, question_text, option_a, option_b, option_c, option_d, difficulty
           FROM questions ${fallbackWhere}
           LIMIT ? OFFSET ?`,
          [...fallbackParams, limit, offset]
        );
        return fbRows;
      }
    }

    if (total === 0) {
      return [];
    }

    // Offset-based random selection
    const offset = total > limit ? Math.floor(Math.random() * (total - limit + 1)) : 0;

    const [rows] = await pool.query(
      `SELECT id, topic_id, question_text, option_a, option_b, option_c, option_d, difficulty
       FROM questions ${whereClause}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return rows;
  },
};

module.exports = questionSelector;
