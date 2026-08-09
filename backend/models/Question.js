const crypto = require('crypto');
const pool = require('../config/db');

/**
 * Computes SHA-256 hash of normalized question text
 * @param {string} text 
 * @returns {string} SHA-256 hex string (64 characters)
 */
const generateQuestionHash = (text) => {
  const normalized = (text || '').trim().toLowerCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
};

const Question = {
  generateQuestionHash,

  /**
   * Find paginated list of questions with optional topic, difficulty, and search filters
   */
  findAll: async ({ topic_id, difficulty, search, page = 1, limit = 20 }) => {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    const conditions = ['q.is_active = TRUE'];
    const params = [];

    if (topic_id) {
      conditions.push('q.topic_id = ?');
      params.push(parseInt(topic_id, 10));
    }

    if (difficulty) {
      conditions.push('q.difficulty = ?');
      params.push(difficulty);
    }

    if (search && search.trim()) {
      conditions.push('q.question_text LIKE ?');
      params.push(`%${search.trim()}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM questions q ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;

    // Get page data with topic name
    const query = `
      SELECT 
        q.id,
        q.topic_id,
        t.name AS topic_name,
        q.question_text,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_option,
        q.difficulty,
        q.explanation,
        q.created_at
      FROM questions q
      LEFT JOIN topics t ON q.topic_id = t.id
      ${whereClause}
      ORDER BY q.id DESC
      LIMIT ? OFFSET ?
    `;

    // pool.execute with LIMIT/OFFSET requires numbers or string params
    const [rows] = await pool.query(query, [...params, limitNum, offset]);

    return {
      questions: rows,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    };
  },

  /**
   * Find question by ID
   */
  findById: async (id) => {
    const [rows] = await pool.execute(
      `
      SELECT 
        q.id,
        q.topic_id,
        t.name AS topic_name,
        q.question_text,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_option,
        q.difficulty,
        q.explanation,
        q.question_hash,
        q.is_active,
        q.created_at
      FROM questions q
      LEFT JOIN topics t ON q.topic_id = t.id
      WHERE q.id = ? AND q.is_active = TRUE
      LIMIT 1
      `,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Check if a question with given SHA-256 hash exists in topic
   */
  existsByHash: async (topic_id, hash) => {
    const [rows] = await pool.execute(
      'SELECT id FROM questions WHERE topic_id = ? AND question_hash = ? AND is_active = TRUE LIMIT 1',
      [topic_id, hash]
    );
    return rows.length > 0;
  },

  /**
   * Create a single question
   */
  create: async ({
    topic_id,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
    difficulty,
    explanation = null,
  }) => {
    const hash = generateQuestionHash(question_text);

    const [result] = await pool.execute(
      `
      INSERT INTO questions (
        topic_id, question_text, option_a, option_b, option_c, option_d,
        correct_option, difficulty, explanation, question_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        topic_id,
        question_text.trim(),
        option_a.trim(),
        option_b.trim(),
        option_c.trim(),
        option_d.trim(),
        correct_option.toUpperCase(),
        difficulty,
        explanation ? explanation.trim() : null,
        hash,
      ]
    );

    return result.insertId;
  },

  /**
   * Update question by ID
   */
  update: async (id, fields = {}) => {
    const allowed = [
      'topic_id',
      'question_text',
      'option_a',
      'option_b',
      'option_c',
      'option_d',
      'correct_option',
      'difficulty',
      'explanation',
    ];

    const updates = [];
    const params = [];

    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(fields, key) && fields[key] !== undefined) {
        if (key === 'question_text') {
          updates.push('question_text = ?');
          params.push(fields.question_text.trim());
          updates.push('question_hash = ?');
          params.push(generateQuestionHash(fields.question_text));
        } else if (key === 'correct_option') {
          updates.push('correct_option = ?');
          params.push(fields.correct_option.toUpperCase());
        } else if (typeof fields[key] === 'string') {
          updates.push(`${key} = ?`);
          params.push(fields[key].trim());
        } else {
          updates.push(`${key} = ?`);
          params.push(fields[key]);
        }
      }
    }

    if (updates.length === 0) return;

    params.push(id);
    await pool.execute(
      `UPDATE questions SET ${updates.join(', ')} WHERE id = ? AND is_active = TRUE`,
      params
    );
  },

  /**
   * Soft delete question
   */
  softDelete: async (id) => {
    await pool.execute(
      'UPDATE questions SET is_active = FALSE WHERE id = ?',
      [id]
    );
  },
};

module.exports = Question;
