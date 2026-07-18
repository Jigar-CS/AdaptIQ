const pool = require('../config/db');

const Topic = {
  /** Get all active topics */
  findAll: async () => {
    const [rows] = await pool.execute(
      'SELECT id, name, description, created_at FROM topics WHERE is_active = TRUE ORDER BY name'
    );
    return rows;
  },

  /** Find topic by ID */
  findById: async (id) => {
    const [rows] = await pool.execute(
      'SELECT * FROM topics WHERE id = ? AND is_active = TRUE LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  /** Create a new topic */
  create: async ({ name, description }) => {
    const [result] = await pool.execute(
      'INSERT INTO topics (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    return result.insertId;
  },

  /** Update a topic */
  update: async (id, { name, description }) => {
    await pool.execute(
      'UPDATE topics SET name = ?, description = ? WHERE id = ?',
      [name, description || null, id]
    );
  },

  /** Soft-delete a topic */
  softDelete: async (id) => {
    await pool.execute('UPDATE topics SET is_active = FALSE WHERE id = ?', [id]);
  },
};

module.exports = Topic;
