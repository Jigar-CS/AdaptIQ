const pool = require('../config/db');

const UserAnswer = {
  /**
   * Submit an answer for a question in a test
   */
  submit: async ({
    test_id,
    question_id,
    user_id,
    selected_option,
    is_correct,
    response_time_seconds,
  }) => {
    const [result] = await pool.execute(
      `INSERT INTO user_answers (
        test_id, question_id, user_id, selected_option, is_correct, response_time_seconds
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        test_id,
        question_id,
        user_id,
        selected_option || null,
        is_correct ? 1 : 0,
        response_time_seconds,
      ]
    );
    return result.insertId;
  },

  /**
   * Count total answers submitted in a test
   */
  countByTestId: async (test_id) => {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM user_answers WHERE test_id = ?`,
      [test_id]
    );
    return rows[0]?.total || 0;
  },

  /**
   * Get answers in the latest batch of 5 questions
   */
  getLastBatchAnswers: async (test_id, limit = 5) => {
    const [rows] = await pool.execute(
      `SELECT ua.id, ua.question_id, ua.selected_option, ua.is_correct, ua.response_time_seconds, ua.answered_at
       FROM user_answers ua
       WHERE ua.test_id = ?
       ORDER BY ua.id DESC
       LIMIT ?`,
      [test_id, limit]
    );
    return rows;
  },

  /**
   * Get all answers for a test
   */
  getByTestId: async (test_id) => {
    const [rows] = await pool.execute(
      `SELECT ua.id, ua.question_id, ua.selected_option, ua.is_correct, ua.response_time_seconds, ua.answered_at,
              q.difficulty, q.topic_id
       FROM user_answers ua
       JOIN questions q ON ua.question_id = q.id
       WHERE ua.test_id = ?
       ORDER BY ua.id ASC`,
      [test_id]
    );
    return rows;
  },
};

module.exports = UserAnswer;
