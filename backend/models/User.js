const pool = require('../config/db');

const User = {
  /** Find a user by email */
  findByEmail: async (email) => {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ? AND is_active = TRUE LIMIT 1',
      [email]
    );
    return rows[0] || null;
  },

  /** Find a user by ID */
  findById: async (id) => {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ? AND is_active = TRUE LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  /** Create a new user */
  create: async ({ name, email, password_hash, role = 'student' }) => {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, password_hash, role]
    );
    return result.insertId;
  },

  /** Update profile fields */
  updateProfile: async (id, { name, email }) => {
    await pool.execute(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]
    );
  },

  /** Update password */
  updatePassword: async (id, password_hash) => {
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [password_hash, id]
    );
  },
};

module.exports = User;
