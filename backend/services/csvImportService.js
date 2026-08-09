const fs = require('fs');
const csvParser = require('csv-parser');
const pool = require('../config/db');
const Question = require('../models/Question');

/**
 * Normalizes difficulty input to Easy, Medium, or Hard
 */
const normalizeDifficulty = (diffStr) => {
  if (!diffStr) return null;
  const cleaned = diffStr.toString().trim().toLowerCase();
  if (cleaned === 'easy' || cleaned === 'e') return 'Easy';
  if (cleaned === 'medium' || cleaned === 'med' || cleaned === 'm') return 'Medium';
  if (cleaned === 'hard' || cleaned === 'h') return 'Hard';
  return null;
};

/**
 * Normalizes correct option input to A, B, C, or D
 */
const normalizeOption = (optStr) => {
  if (!optStr) return null;
  const cleaned = optStr.toString().trim().toUpperCase();
  if (['A', 'B', 'C', 'D'].includes(cleaned)) return cleaned;
  return null;
};

/**
 * Streaming CSV Question Importer
 */
const importCsv = async ({ filePath, defaultTopicId }) => {
  const errors = [];
  let totalRows = 0;
  let skippedDuplicates = 0;
  let inserted = 0;

  // 1. Pre-load active topics map from DB
  const [topicRows] = await pool.execute('SELECT id, name FROM topics WHERE is_active = TRUE');
  const topicMapByName = new Map();
  const topicIdSet = new Set();
  for (const t of topicRows) {
    topicMapByName.set(t.name.trim().toLowerCase(), t.id);
    topicIdSet.add(t.id);
  }

  // 2. Pre-load existing (topic_id, question_hash) pairs into Set
  const [hashRows] = await pool.execute(
    'SELECT topic_id, question_hash FROM questions WHERE is_active = TRUE'
  );
  const existingHashSet = new Set();
  for (const h of hashRows) {
    existingHashSet.add(`${h.topic_id}_${h.question_hash}`);
  }

  const validBatch = [];
  const parsedRows = [];

  // 3. Parse CSV line-by-line via stream
  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => {
        parsedRows.push(data);
      })
      .on('end', resolve)
      .on('error', reject);
  });

  // Clean up uploaded CSV temp file after streaming read
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    console.error('Failed to unlink CSV temp file:', e);
  }

  // 4. Validate and deduplicate parsed rows
  for (let i = 0; i < parsedRows.length; i++) {
    const row = parsedRows[i];
    const rowNum = i + 1; // 1-indexed CSV row
    totalRows++;

    // Normalize keys (case-insensitive column lookup)
    const rowKeys = Object.keys(row);
    const getVal = (keyNames) => {
      for (const k of rowKeys) {
        if (keyNames.includes(k.trim().toLowerCase().replace(/[\s_-]+/g, ''))) {
          return row[k];
        }
      }
      return null;
    };

    const rawQuestion = getVal(['question', 'questiontext', 'text']);
    const rawOptA = getVal(['optiona', 'opta', 'a']);
    const rawOptB = getVal(['optionb', 'optb', 'b']);
    const rawOptC = getVal(['optionc', 'optc', 'c']);
    const rawOptD = getVal(['optiond', 'optd', 'd']);
    const rawCorrect = getVal(['correctoption', 'correct', 'answer', 'correctans']);
    const rawDiff = getVal(['difficulty', 'diff', 'level']);
    const rawTopic = getVal(['topic', 'topicname', 'topicid']);
    const rawExplanation = getVal(['explanation', 'explain']);

    // Check required fields present
    if (!rawQuestion || !rawQuestion.trim()) {
      errors.push({ row: rowNum, reason: 'Missing question text' });
      continue;
    }
    if (!rawOptA || !rawOptB || !rawOptC || !rawOptD) {
      errors.push({ row: rowNum, reason: 'All 4 options (A, B, C, D) are required' });
      continue;
    }

    // Determine topic ID
    let topicId = null;
    if (rawTopic) {
      const topicStr = rawTopic.toString().trim();
      if (!isNaN(topicStr) && topicIdSet.has(parseInt(topicStr, 10))) {
        topicId = parseInt(topicStr, 10);
      } else {
        const foundId = topicMapByName.get(topicStr.toLowerCase());
        if (foundId) topicId = foundId;
      }
    }
    if (!topicId && defaultTopicId) {
      topicId = parseInt(defaultTopicId, 10);
    }
    if (!topicId || !topicIdSet.has(topicId)) {
      errors.push({ row: rowNum, reason: `Invalid or missing topic: "${rawTopic || defaultTopicId || 'None'}"` });
      continue;
    }

    // Validate correct option
    const correctOption = normalizeOption(rawCorrect);
    if (!correctOption) {
      errors.push({ row: rowNum, reason: `Invalid correct option "${rawCorrect}". Must be A, B, C, or D` });
      continue;
    }

    // Validate difficulty
    const difficulty = normalizeDifficulty(rawDiff);
    if (!difficulty) {
      errors.push({ row: rowNum, reason: `Invalid difficulty "${rawDiff}". Must be Easy, Medium, or Hard` });
      continue;
    }

    // Calculate hash and check duplicate
    const questionText = rawQuestion.trim();
    const hash = Question.generateQuestionHash(questionText);
    const dedupeKey = `${topicId}_${hash}`;

    if (existingHashSet.has(dedupeKey)) {
      skippedDuplicates++;
      continue;
    }

    // Add to existing hash set to deduplicate within the same CSV file
    existingHashSet.add(dedupeKey);

    validBatch.push([
      topicId,
      questionText,
      rawOptA.trim(),
      rawOptB.trim(),
      rawOptC.trim(),
      rawOptD.trim(),
      correctOption,
      difficulty,
      rawExplanation ? rawExplanation.trim() : null,
      hash,
    ]);
  }

  // 5. Transaction-backed chunked inserts (~100 rows/chunk)
  if (validBatch.length > 0) {
    const CHUNK_SIZE = 100;
    for (let i = 0; i < validBatch.length; i += CHUNK_SIZE) {
      const chunk = validBatch.slice(i, i + CHUNK_SIZE);
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();

        const sql = `
          INSERT INTO questions (
            topic_id, question_text, option_a, option_b, option_c, option_d,
            correct_option, difficulty, explanation, question_hash
          ) VALUES ?
        `;

        const [result] = await conn.query(sql, [chunk]);
        await conn.commit();
        inserted += result.affectedRows;
      } catch (err) {
        await conn.rollback();
        console.error('Batch insert chunk error:', err);
        // Log individual chunk failure
        chunk.forEach((row, idx) => {
          errors.push({ row: i + idx + 1, reason: `Database insert failure: ${err.message}` });
        });
      } finally {
        conn.release();
      }
    }
  }

  return {
    total_rows: totalRows,
    inserted,
    skipped_duplicates: skippedDuplicates,
    errors,
  };
};

module.exports = { importCsv };
