const pool = require('../config/db');

const REQUIRED_PROFILE_FIELDS = [
  'phone',
  'college',
  'branch',
  'graduation_year',
  'cgpa',
  'profile_photo_path',
  'resume_path',
];

const buildProfileSelect = `
  id,
  name,
  email,
  role,
  phone,
  college,
  branch,
  graduation_year,
  cgpa,
  linkedin_url,
  profile_photo_path,
  resume_path,
  profile_prompt_triggered,
  is_profile_complete,
  created_at,
  updated_at
`;

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
      `SELECT ${buildProfileSelect} FROM users WHERE id = ? AND is_active = TRUE LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  /** Find a user by ID including password hash for sensitive flows */
  findByIdWithPassword: async (id) => {
    const [rows] = await pool.execute(
      'SELECT id, password_hash FROM users WHERE id = ? AND is_active = TRUE LIMIT 1',
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
  updateProfile: async (id, fields = {}) => {
    const allowed = [
      'name',
      'email',
      'phone',
      'college',
      'branch',
      'graduation_year',
      'cgpa',
      'linkedin_url',
    ];

    const updates = [];
    const params = [];

    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(fields, key)) {
        updates.push(`${key} = ?`);
        params.push(fields[key]);
      }
    }

    if (updates.length === 0) {
      return;
    }

    params.push(id);
    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const isComplete = await User.checkProfileComplete(id);
    await pool.execute(
      'UPDATE users SET is_profile_complete = ? WHERE id = ?',
      [isComplete ? 1 : 0, id]
    );
  },

  /** Update password */
  updatePassword: async (id, password_hash) => {
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [password_hash, id]
    );
  },

  updatePhotoPath: async (id, path) => {
    await pool.execute(
      'UPDATE users SET profile_photo_path = ? WHERE id = ?',
      [path, id]
    );
    const isComplete = await User.checkProfileComplete(id);
    await pool.execute(
      'UPDATE users SET is_profile_complete = ? WHERE id = ?',
      [isComplete ? 1 : 0, id]
    );
  },

  updateResumePath: async (id, path) => {
    await pool.execute(
      'UPDATE users SET resume_path = ? WHERE id = ?',
      [path, id]
    );
    const isComplete = await User.checkProfileComplete(id);
    await pool.execute(
      'UPDATE users SET is_profile_complete = ? WHERE id = ?',
      [isComplete ? 1 : 0, id]
    );
  },

  checkProfileComplete: async (id) => {
    const [rows] = await pool.execute(
      'SELECT phone, college, branch, graduation_year, cgpa, profile_photo_path, resume_path FROM users WHERE id = ? AND is_active = TRUE LIMIT 1',
      [id]
    );
    const user = rows[0];
    if (!user) return false;

    return REQUIRED_PROFILE_FIELDS.every((field) => {
      const value = user[field];
      return value !== null && value !== undefined && `${value}`.trim() !== '';
    });
  },

  triggerProfilePrompt: async (id) => {
    await pool.execute(
      'UPDATE users SET profile_prompt_triggered = TRUE WHERE id = ?',
      [id]
    );
  },
};

module.exports = User;
