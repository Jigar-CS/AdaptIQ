import apiClient from './apiClient';

const adaptiveService = {
  /** Pass topicId to start a topic-scoped session, omit for a full_adaptive (Miscellaneous) session. */
  start: async (topicId) => {
    const { data } = await apiClient.post('/adaptive/start', topicId ? { topic_id: topicId } : {});
    return data.data;
  },

  getNextBatch: async (testId) => {
    const { data } = await apiClient.get(`/adaptive/${testId}/next-batch`);
    return data.data;
  },

  submitAnswer: async (testId, payload) => {
    const { data } = await apiClient.post(`/adaptive/${testId}/answer`, payload);
    return data.data;
  },

  getStatus: async (testId) => {
    const { data } = await apiClient.get(`/adaptive/${testId}/status`);
    return data.data;
  },

  complete: async (testId) => {
    const { data } = await apiClient.post(`/adaptive/${testId}/complete`);
    return data.data;
  },
};

export default adaptiveService;
