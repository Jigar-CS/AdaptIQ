const fs = require('fs');
const csvParser = require('csv-parser');
const pool = require('../config/db');
const Question = require('../models/Question');
const Topic = require('../models/Topic');

/**
 * Cleans text strings, strips enclosing quotes and common question prefixes (e.g. "Q1: ", "1. ")
 */
const cleanText = (str) => {
  if (str === null || str === undefined) return '';
  let s = str.toString().trim();
  // Remove wrapping quotes if any
  s = s.replace(/^["'](.*)["']$/s, '$1').trim();
  // Strip leading question prefixes like "1. ", "Q1: ", "Q. ", "1) "
  s = s.replace(/^(?:q\.?\s*\d*[\:\.\)]?\s*|\d+[\.\)]\s*)/i, '').trim();
  return s;
};

/**
 * Normalizes difficulty input to Easy, Medium, or Hard with Medium fallback
 */
const normalizeDifficulty = (diffStr) => {
  if (!diffStr) return 'Medium';
  const cleaned = diffStr.toString().trim().toLowerCase();
  if (['easy', 'e', '1', 'beginner', 'basic', 'simple'].includes(cleaned)) return 'Easy';
  if (['medium', 'med', 'm', '2', 'intermediate', 'normal', 'moderate'].includes(cleaned)) return 'Medium';
  if (['hard', 'h', '3', 'advanced', 'difficult', 'expert', 'complex'].includes(cleaned)) return 'Hard';
  return 'Medium'; // Default fallback
};

/**
 * Smart correct option normalizer: accepts 'A'-'D', '1'-'4', 'Option A'/'Choice 3', or full text matching option A-D
 */
const normalizeOption = (rawCorrect, optA, optB, optC, optD) => {
  if (!rawCorrect) return null;
  const raw = rawCorrect.toString().trim();
  const upper = raw.toUpperCase();

  // 1. Direct letter match (A, B, C, D)
  if (['A', 'B', 'C', 'D'].includes(upper)) return upper;

  // 2. Numeric index match (1->A, 2->B, 3->C, 4->D)
  if (upper === '1') return 'A';
  if (upper === '2') return 'B';
  if (upper === '3') return 'C';
  if (upper === '4') return 'D';

  // 3. String patterns like "Option A", "Choice B", "Choice 3", "Ans: C", "Option 2"
  const match = upper.match(/(?:OPTION|CHOICE|ANS|ANSWER)\s*[:=]?\s*([A-D1-4])/i);
  if (match) {
    const val = match[1].toUpperCase();
    if (['A', 'B', 'C', 'D'].includes(val)) return val;
    if (val === '1') return 'A';
    if (val === '2') return 'B';
    if (val === '3') return 'C';
    if (val === '4') return 'D';
  }

  // 4. Match full text against option strings
  const normVal = raw.toLowerCase().trim();
  if (optA && normVal === optA.toLowerCase().trim()) return 'A';
  if (optB && normVal === optB.toLowerCase().trim()) return 'B';
  if (optC && normVal === optC.toLowerCase().trim()) return 'C';
  if (optD && normVal === optD.toLowerCase().trim()) return 'D';

  return null;
};

const COLUMN_ALIASES = {
  question: ['question', 'questiontext', 'question_text', 'qtext', 'q_text', 'questioncontent', 'prompt', 'text', 'problem', 'item', 'query', 'q'],
  option_a: ['optiona', 'option_a', 'opta', 'opt_a', 'choicea', 'choice_a', 'choice1', 'option1', 'a', 'val_a', 'choice_1'],
  option_b: ['optionb', 'option_b', 'optb', 'opt_b', 'choiceb', 'choice_b', 'choice2', 'option2', 'b', 'val_b', 'choice_2'],
  option_c: ['optionc', 'option_c', 'optc', 'opt_c', 'choicec', 'choice_c', 'choice3', 'option3', 'c', 'val_c', 'choice_3'],
  option_d: ['optiond', 'option_d', 'optd', 'opt_d', 'choiced', 'choice_d', 'choice4', 'option4', 'd', 'val_d', 'choice_4'],
  correct: ['correctoption', 'correct_option', 'correct', 'answer', 'ans', 'correctans', 'correct_ans', 'rightoption', 'rightans', 'key', 'solution_key'],
  difficulty: ['difficulty', 'diff', 'level', 'difficultylevel', 'grade', 'complexity'],
  topic: ['topic', 'topicname', 'topic_name', 'topicid', 'topic_id', 'category', 'subject', 'subtopic', 'sub_topic'],
  explanation: ['explanation', 'explain', 'solution', 'rationale', 'remark', 'exp', 'notes']
};

const KEYWORD_MAP = [
  { keywords: ['percent', 'percentage', 'profit', 'loss', 'discount', 'markup'], name: 'Percentages & Profit/Loss' },
  { keywords: ['speed', 'distance', 'train', 'boat', 'stream', 'motion', 'travel'], name: 'Time, Speed & Distance' },
  { keywords: ['work', 'cistern', 'pipe', 'wage', 'efficiency'], name: 'Work & Time' },
  { keywords: ['number', 'series', 'lcm', 'hcf', 'divisibility', 'remainder', 'sequence'], name: 'Number Systems & Series' },
  { keywords: ['permutation', 'combination', 'probability', 'dice', 'card', 'arrangement'], name: 'Permutations & Probability' },
  { keywords: ['syllogism', 'deduction', 'statement', 'conclusion', 'venn', 'logic'], name: 'Logical Deduction & Syllogisms' },
  { keywords: ['data', 'interpretation', 'chart', 'graph', 'table', 'sufficiency'], name: 'Data Interpretation' },
  { keywords: ['blood', 'relation', 'family', 'direction', 'compass', 'north', 'south', 'east', 'west'], name: 'Blood Relations & Directions' },
  { keywords: ['clock', 'calendar', 'leap', 'day', 'angle', 'hour'], name: 'Clocks & Calendars' },
  { keywords: ['ratio', 'proportion', 'average', 'mixture', 'alligation'], name: 'Averages, Ratios & Mixtures' }
];

/**
 * Resolves topic string to existing DB topic ID, or auto-detects from question text keywords, or auto-creates new topic dynamically
 */
const resolveOrCreateTopic = async (rawTopicStr, questionText, topicMapByName, topicIdSet, topicIdToNameMap) => {
  const str = rawTopicStr ? rawTopicStr.toString().trim() : '';

  if (str) {
    // 1. Numeric topic ID
    if (!isNaN(str) && topicIdSet.has(parseInt(str, 10))) {
      return parseInt(str, 10);
    }

    const lowerStr = str.toLowerCase();

    // 2. Exact match in existing DB topics
    if (topicMapByName.has(lowerStr)) {
      return topicMapByName.get(lowerStr);
    }

    // 3. Keyword-based matching to standard Aptitude & Reasoning sub-topics
    for (const item of KEYWORD_MAP) {
      if (item.keywords.some((kw) => lowerStr.includes(kw))) {
        const existingId = topicMapByName.get(item.name.toLowerCase());
        if (existingId) return existingId;
      }
    }

    // 4. Substring / partial match against existing topics
    for (const [tName, id] of topicMapByName.entries()) {
      if (tName.includes(lowerStr) || lowerStr.includes(tName.split(' ')[0])) {
        return id;
      }
    }
  }

  // 5. Smart auto-detect from question text keywords if no topic column or unresolved topic string
  if (questionText) {
    const qLower = questionText.toLowerCase();

    // Match against KEYWORD_MAP first
    for (const item of KEYWORD_MAP) {
      if (item.keywords.some((kw) => qLower.includes(kw))) {
        const existingId = topicMapByName.get(item.name.toLowerCase());
        if (existingId) return existingId;
      }
    }

    // Match against DB topic names (significant words)
    for (const [tName, id] of topicMapByName.entries()) {
      const keywords = tName.split(/[\s,&]+/).filter((w) => w.length > 3);
      if (keywords.some((kw) => qLower.includes(kw))) {
        return id;
      }
    }
  }

  // 6. Auto-create new topic dynamically if new Aptitude sub-topic provided in str
  if (str) {
    const formattedName = str
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    try {
      const newId = await Topic.create({
        name: formattedName,
        description: `Aptitude & Reasoning topic: ${formattedName}`,
      });

      topicMapByName.set(formattedName.toLowerCase(), newId);
      topicIdSet.add(newId);
      if (topicIdToNameMap) {
        topicIdToNameMap.set(newId, formattedName);
      }
      return newId;
    } catch (err) {
      console.error(`Failed to auto-create topic "${formattedName}":`, err.message);
      return null;
    }
  }

  return null;
};

/**
 * Streaming & Auto-Cleaning CSV Question Importer
 */
const importCsv = async ({ filePath, defaultTopicId }) => {
  const errors = [];
  let totalRows = 0;
  let skippedDuplicates = 0;
  let cleanedCount = 0;
  let inserted = 0;

  // 1. Pre-load active topics map from DB
  const [topicRows] = await pool.execute('SELECT id, name FROM topics WHERE is_active = TRUE');
  const topicMapByName = new Map();
  const topicIdSet = new Set();
  const topicIdToNameMap = new Map();

  for (const t of topicRows) {
    const tName = t.name.trim().toLowerCase();
    topicMapByName.set(tName, t.id);
    topicIdSet.add(t.id);
    topicIdToNameMap.set(t.id, t.name);
  }

  // Fallback default topic: if defaultTopicId is valid ID use it, else default to first DB topic
  const parsedDefaultTopicId = (defaultTopicId && defaultTopicId !== 'auto' && !isNaN(defaultTopicId))
    ? parseInt(defaultTopicId, 10)
    : null;
  const fallbackTopicId = (parsedDefaultTopicId && topicIdSet.has(parsedDefaultTopicId))
    ? parsedDefaultTopicId
    : (topicRows.length > 0 ? topicRows[0].id : null);

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
  const topicBreakdown = {};

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

  // 4. Validate, auto-clean, and deduplicate parsed rows
  for (let i = 0; i < parsedRows.length; i++) {
    const row = parsedRows[i];
    const rowNum = i + 1; // 1-indexed CSV row
    totalRows++;

    // Normalize keys (fuzzy case & punctuation-insensitive column lookup)
    const rowKeys = Object.keys(row);
    const getVal = (aliases) => {
      for (const k of rowKeys) {
        const cleanedKey = k.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        if (aliases.includes(cleanedKey)) {
          return row[k];
        }
      }
      return null;
    };

    const rawQuestion = getVal(COLUMN_ALIASES.question);
    const rawOptA = getVal(COLUMN_ALIASES.option_a);
    const rawOptB = getVal(COLUMN_ALIASES.option_b);
    const rawOptC = getVal(COLUMN_ALIASES.option_c);
    const rawOptD = getVal(COLUMN_ALIASES.option_d);
    const rawCorrect = getVal(COLUMN_ALIASES.correct);
    const rawDiff = getVal(COLUMN_ALIASES.difficulty);
    const rawTopic = getVal(COLUMN_ALIASES.topic);
    const rawExplanation = getVal(COLUMN_ALIASES.explanation);

    const questionText = cleanText(rawQuestion);
    const optA = cleanText(rawOptA);
    const optB = cleanText(rawOptB);
    const optC = cleanText(rawOptC);
    const optD = cleanText(rawOptD);

    // Check required fields present
    if (!questionText) {
      errors.push({ row: rowNum, reason: 'Missing question text' });
      continue;
    }
    if (!optA || !optB || !optC || !optD) {
      errors.push({ row: rowNum, reason: 'All 4 options (A, B, C, D) are required' });
      continue;
    }

    // Determine & resolve target sub-topic ID per row (auto-detect from rawTopic or questionText)
    let topicId = await resolveOrCreateTopic(rawTopic, questionText, topicMapByName, topicIdSet, topicIdToNameMap);

    if (!topicId) {
      topicId = fallbackTopicId;
    }
    if (!topicId || !topicIdSet.has(topicId)) {
      errors.push({ row: rowNum, reason: `Invalid or missing topic mapping for: "${rawTopic || 'None'}"` });
      continue;
    }

    // Validate & smart-clean correct option
    const correctOption = normalizeOption(rawCorrect, optA, optB, optC, optD);
    if (!correctOption) {
      errors.push({ row: rowNum, reason: `Invalid correct option "${rawCorrect}". Could not match A/B/C/D or option text.` });
      continue;
    }

    // Validate & smart-clean difficulty
    const difficulty = normalizeDifficulty(rawDiff);

    // Check if auto-cleaning occurred
    if (rawQuestion !== questionText || !['A', 'B', 'C', 'D'].includes((rawCorrect || '').toString().trim().toUpperCase()) || !rawDiff) {
      cleanedCount++;
    }

    // Calculate hash and check duplicate
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
      optA,
      optB,
      optC,
      optD,
      correctOption,
      difficulty,
      rawExplanation ? cleanText(rawExplanation) : null,
      hash,
    ]);

    const topicName = topicIdToNameMap.get(topicId) || 'General Aptitude';
    topicBreakdown[topicName] = (topicBreakdown[topicName] || 0) + 1;
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
    cleaned_count: cleanedCount,
    skipped_duplicates: skippedDuplicates,
    errors,
    topic_breakdown: topicBreakdown,
  };
};

module.exports = { importCsv };
