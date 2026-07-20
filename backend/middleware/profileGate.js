const User = require('../models/User');

const profileGate = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User authentication failed' },
      });
    }

    if (user.profile_prompt_triggered && !user.is_profile_complete) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'PROFILE_INCOMPLETE',
          message: 'Please complete your profile to continue taking tests.',
        },
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = profileGate;
