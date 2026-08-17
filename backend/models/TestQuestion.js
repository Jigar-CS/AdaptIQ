const pool = require('../config/db');

const TestQuestion = {
  /**
   * Add a single question to a test session
   */
  addQuestion: async ({ test_id, question_id, sequence_number, difficulty_at_time }) => {
    const [result] = await pool.execute(
      `INSERT INTO test_questions (test_id, question_id, sequence_number, difficulty_at_time)
       VALUES (?, ?, ?, ?)`,
      [test_id, question_id, sequence_number, difficulty_at_time]
    );
    return result.insertId;
  },

  /**
   * Add a batch of questions to a test session
   */
  addBatch: async (test_id, questions, startSequence, difficulty_at_time) => {
    if (!questions || questions.length === 0) return;
    const values = [];
    const placeholders = [];

    questions.forEach((q, idx) => {
      placeholders.push('(?, ?, ?, ?)');
      values.push(test_id, q.id, startSequence + idx, difficulty_at_time);
    });

    await pool.execute(
      `INSERT INTO test_questions (test_id, question_id, sequence_number, difficulty_at_time)
       VALUES ${placeholders.join(', ')}`,
      values
    );
  },

  /**
   * Get all question IDs already served in this test session
   */
  getServedQuestionIds: async (test_id) => {
    const [rows] = await pool.execute(
      `SELECT question_id FROM test_questions WHERE test_id = ? ORDER BY sequence_number ASC`,
      [test_id]
    );
    return rows.map((r) => r.question_id);
  },

  /**
   * Get total count of questions served in this test
   */
  getServedCount: async (test_id) => {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS count FROM test_questions WHERE test_id = ?`,
      [test_id]
    );
    return rows[0]?.count || 0;
  },

  /**
   * Get latest difficulty recorded in test
   */
  getLatestDifficulty: async (test_id) => {
    const [rows] = await pool.execute(
      `SELECT difficulty_at_time 
       FROM test_questions 
       WHERE test_id = ? 
       ORDER BY sequence_number DESC 
       LIMIT 1`,
      [test_id]
    );
    return rows[0]?.difficulty_at_time || 'Easy';
  },
};

module.exports = TestQuestion;
