const PlacementScore = require('../models/PlacementScore');
const Test = require('../models/Test');

const placementScoreController = {
  /**
   * GET /placement-score
   * Returns the latest placement score + breakdown + misc test count
   */
  getLatest: async (req, res, next) => {
    try {
      const user_id = req.user.id;

      const latest = await PlacementScore.getLatest(user_id);
      const miscTestsCompleted = await Test.countCompletedByType(user_id, 'full_adaptive');
      const globalRank = await PlacementScore.getGlobalRank(user_id);

      if (!latest) {
        return res.json({
          success: true,
          data: {
            score: 0,
            accuracy_component: 0,
            speed_component: 0,
            difficulty_mastery_component: 0,
            misc_tests_completed: miscTestsCompleted,
            global_rank: null,
            current_streak_days: null,
            calculated_at: null,
          },
        });
      }

      return res.json({
        success: true,
        data: {
          score: parseFloat(latest.score),
          accuracy_component: parseFloat(latest.accuracy_component),
          speed_component: parseFloat(latest.speed_component),
          difficulty_mastery_component: parseFloat(latest.difficulty_mastery_component),
          misc_tests_completed: miscTestsCompleted,
          global_rank: globalRank,
          current_streak_days: null, // TODO: implement streak tracking in a future phase
          calculated_at: latest.calculated_at,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /placement-score/history
   * Returns all historical placement scores for trend chart
   */
  getHistory: async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const history = await PlacementScore.getHistory(user_id);

      const formatted = history.map((entry) => ({
        score: parseFloat(entry.score),
        accuracy_component: parseFloat(entry.accuracy_component),
        speed_component: parseFloat(entry.speed_component),
        difficulty_mastery_component: parseFloat(entry.difficulty_mastery_component),
        calculated_at: entry.calculated_at,
      }));

      return res.json({
        success: true,
        data: formatted,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = placementScoreController;
