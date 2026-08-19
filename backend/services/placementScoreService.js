const pool = require('../config/db');
const PlacementScore = require('../models/PlacementScore');

/**
 * Expected response time (seconds) per difficulty level.
 * Used to normalize the speed component.
 */
const EXPECTED_TIME = {
  Easy: 45,
  Medium: 60,
  Hard: 90,
};

const placementScoreService = {
  /**
   * Recalculate and persist the placement score for a user.
   * Only considers completed full_adaptive tests.
   *
   * Formula:
   *   score = (accuracy × 0.6) + (speedScore × 0.2) + (difficultyMastery × 0.2)
   *
   * - accuracy: correct % across ALL full_adaptive attempts
   * - speedScore: normalized against expected time per difficulty
   * - difficultyMastery: % of Hard questions answered correctly in full_adaptive
   */
  recalculate: async (user_id) => {
    // Get all answers from completed full_adaptive tests
    const [answers] = await pool.execute(
      `SELECT ua.is_correct, ua.response_time_seconds, q.difficulty
       FROM user_answers ua
       JOIN tests t ON ua.test_id = t.id
       JOIN questions q ON ua.question_id = q.id
       WHERE t.user_id = ? 
         AND t.test_type = 'full_adaptive' 
         AND t.status = 'completed'`,
      [user_id]
    );

    // Edge case: no full_adaptive answers yet
    if (!answers || answers.length === 0) {
      return null;
    }

    // --- Accuracy component (60% weight) ---
    const totalAttempted = answers.length;
    const totalCorrect = answers.filter((a) => a.is_correct === 1).length;
    const accuracy = (totalCorrect / totalAttempted) * 100;

    // --- Speed component (20% weight) ---
    // For each answer, compute how well the student performed vs expected time.
    // speedRatio = expectedTime / actualTime (capped at 1.0 for very fast, floor at 0)
    let speedSum = 0;
    for (const answer of answers) {
      const expected = EXPECTED_TIME[answer.difficulty] || 60;
      const actual = Math.max(answer.response_time_seconds, 1); // avoid div by zero
      const ratio = Math.min(expected / actual, 2.0); // cap at 2x speed bonus
      speedSum += ratio;
    }
    const speedScore = (speedSum / totalAttempted / 2.0) * 100; // normalize to 0-100

    // --- Difficulty mastery component (20% weight) ---
    const hardQuestions = answers.filter((a) => a.difficulty === 'Hard');
    let difficultyMastery = 0;
    if (hardQuestions.length > 0) {
      const hardCorrect = hardQuestions.filter((a) => a.is_correct === 1).length;
      difficultyMastery = (hardCorrect / hardQuestions.length) * 100;
    }
    // Edge case per plan: if no Hard questions attempted, difficultyMastery = 0

    // --- Composite score ---
    const compositeScore = accuracy * 0.6 + speedScore * 0.2 + difficultyMastery * 0.2;

    // Clamp to 0-100
    const finalScore = Math.min(Math.max(parseFloat(compositeScore.toFixed(2)), 0), 100);
    const finalAccuracy = parseFloat(accuracy.toFixed(2));
    const finalSpeed = parseFloat(Math.min(speedScore, 100).toFixed(2));
    const finalMastery = parseFloat(difficultyMastery.toFixed(2));

    // Persist as a new history entry
    await PlacementScore.save({
      user_id,
      score: finalScore,
      accuracy_component: finalAccuracy,
      speed_component: finalSpeed,
      difficulty_mastery_component: finalMastery,
    });

    return {
      score: finalScore,
      accuracy_component: finalAccuracy,
      speed_component: finalSpeed,
      difficulty_mastery_component: finalMastery,
    };
  },
};

module.exports = placementScoreService;
