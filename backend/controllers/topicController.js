const Topic = require('../models/Topic');
const { success, created, notFound } = require('../utils/responseFormatter');

const getAllTopics = async (req, res, next) => {
  try {
    const topics = await Topic.findAll();
    return success(res, { topics });
  } catch (err) {
    next(err);
  }
};

const createTopic = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const id = await Topic.create({ name, description });
    return created(res, { id }, 'Topic created successfully');
  } catch (err) {
    next(err);
  }
};

const updateTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return notFound(res, 'Topic not found');
    await Topic.update(req.params.id, req.body);
    return success(res, {}, 'Topic updated successfully');
  } catch (err) {
    next(err);
  }
};

const deleteTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return notFound(res, 'Topic not found');
    await Topic.softDelete(req.params.id);
    return success(res, {}, 'Topic deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllTopics, createTopic, updateTopic, deleteTopic };
