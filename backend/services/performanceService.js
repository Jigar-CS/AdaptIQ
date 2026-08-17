const pool = require('../config/db');
const Performance = require('../models/Performance');
const Recommendation = require('../models/Recommendation');

/**
 * performanceService
 * Called after an adaptive test completes to update aggregates and generate recommendations.
 */
const performanceService = {
  /**
   * Process all answers from a completed test and write to performance + recommendations.
   */
  processTestCompletion: async (test_id, user_id, test_type, topic_id = null) => {
    // Pull all answers for this test with question difficulty + topic
    const [answers] = await pool.execute(
      `SELECT ua.is_correct, ua.response_time_seconds, q.difficulty, q.topic_id
       FROM user_answers ua
       JOIN questions q ON q.id = ua.question_id
       WHERE ua.test_id = ?`,
      [test_id]
    );

    if (answers.length === 0) return;

    // For topic_adaptive: single topic — update that one topic.
    // For full_adaptive: multiple topics — group and update each.
    const topicMap = {};
    for (const a of answers) {
      const tId = a.topic_id;
      if (!topicMap[tId]) {
        topicMap[tId] = { total: 0, correct: 0, time_sum: 0 };
      }
      topicMap[tId].total += 1;
      topicMap[tId].correct += a.is_correct ? 1 : 0;
      topicMap[tId].time_sum += parseFloat(a.response_time_seconds) || 0;
    }

    for (const [tId, stats] of Object.entries(topicMap)) {
      await Performance.upsert({
        user_id,
        topic_id: parseInt(tId, 10),
        added_attempted: stats.total,
        added_correct: stats.correct,
        added_response_time_sum: stats.time_sum,
      });
    }

    // Generate recommendations based on updated topic performance
    await performanceService.generateRecommendations(user_id);
  },

  /**
   * Rule-based recommendation engine — runs after each test completion.
   */
  generateRecommendations: async (user_id) => {
    const topics = await Performance.getByTopic(user_id);

    for (const t of topics) {
      const pct = parseFloat(t.accuracy_percent) || 0;

      if (pct < 40) {
        await Recommendation.upsert({
          user_id,
          topic_id: t.topic_id,
          message: `Your accuracy in ${t.topic_name} is ${Math.round(pct)}%. Consider revising the basics before your next attempt.`,
          recommendation_type: 'weak_topic',
        });
      } else if (pct >= 80) {
        await Recommendation.upsert({
          user_id,
          topic_id: t.topic_id,
          message: `You're excelling in ${t.topic_name} with ${Math.round(pct)}% accuracy. Try harder difficulty questions to challenge yourself.`,
          recommendation_type: 'strong_topic',
        });
      } else if (pct >= 40 && pct < 70) {
        await Recommendation.upsert({
          user_id,
          topic_id: t.topic_id,
          message: `${t.topic_name} needs more practice (${Math.round(pct)}% accuracy). Focus on medium-difficulty questions.`,
          recommendation_type: 'revision',
        });
      }
    }
  },
};

module.exports = performanceService;
