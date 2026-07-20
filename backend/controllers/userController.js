const User = require('../models/User');
const { success } = require('../utils/responseFormatter');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    return success(res, { user });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    await User.updateProfile(req.user.id, { name, email });
    return success(res, {}, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile };
