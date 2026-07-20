const User = require('../models/User');
const { success, error } = require('../utils/responseFormatter');
const { hashPassword, comparePassword } = require('../utils/hashUtils');

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
    const {
      name,
      email,
      phone,
      college,
      branch,
      graduation_year,
      cgpa,
      linkedin_url,
    } = req.body;

    await User.updateProfile(req.user.id, {
      name,
      email,
      phone,
      college,
      branch,
      graduation_year,
      cgpa,
      linkedin_url,
    });

    const user = await User.findById(req.user.id);
    return success(res, { user }, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByIdWithPassword(req.user.id);
    if (!user) {
      return error(res, 'USER_NOT_FOUND', 'User not found', 404);
    }

    const valid = await comparePassword(currentPassword, user.password_hash);
    if (!valid) {
      return error(res, 'INVALID_CREDENTIALS', 'Current password is incorrect', 401);
    }

    const password_hash = await hashPassword(newPassword);
    await User.updatePassword(req.user.id, password_hash);
    return success(res, {}, 'Password updated successfully');
  } catch (err) {
    next(err);
  }
};

const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return error(res, 'NO_PHOTO_UPLOADED', 'No photo file was uploaded', 400);
    }

    await User.updatePhotoPath(req.user.id, req.file.filename);
    const user = await User.findById(req.user.id);
    return success(res, { user, photoPath: req.file.filename }, 'Profile photo uploaded successfully');
  } catch (err) {
    next(err);
  }
};

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return error(res, 'NO_RESUME_UPLOADED', 'No resume file was uploaded', 400);
    }

    await User.updateResumePath(req.user.id, req.file.filename);
    const user = await User.findById(req.user.id);
    return success(res, { user, resumePath: req.file.filename }, 'Resume uploaded successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  uploadProfilePhoto,
  uploadResume,
};
