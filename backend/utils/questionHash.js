const crypto = require('crypto');

/**
 * Returns SHA-256 hash of a normalized question string.
 * Used for duplicate detection within the same topic.
 * Normalization: lowercase, collapse whitespace, trim.
 */
const hashQuestion = (questionText) => {
  const normalized = questionText.toLowerCase().replace(/\s+/g, ' ').trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
};

module.exports = { hashQuestion };
