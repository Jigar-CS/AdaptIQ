import apiClient from './apiClient';

const adminService = {
  // --- Topics ---
  getTopics: async () => {
    const { data } = await apiClient.get('/topics');
    return data.data.topics;
  },

  createTopic: async (topicData) => {
    const { data } = await apiClient.post('/admin/topics', topicData);
    return data.data;
  },

  updateTopic: async (id, topicData) => {
    const { data } = await apiClient.put(`/admin/topics/${id}`, topicData);
    return data.data;
  },

  deleteTopic: async (id) => {
    const { data } = await apiClient.delete(`/admin/topics/${id}`);
    return data.data;
  },

  // --- Questions ---
  getQuestions: async (params = {}) => {
    const { data } = await apiClient.get('/admin/questions', { params });
    return data.data;
  },

  getQuestionById: async (id) => {
    const { data } = await apiClient.get(`/admin/questions/${id}`);
    return data.data.question;
  },

  createQuestion: async (questionData) => {
    const { data } = await apiClient.post('/admin/questions', questionData);
    return data.data.question;
  },

  updateQuestion: async (id, questionData) => {
    const { data } = await apiClient.put(`/admin/questions/${id}`, questionData);
    return data.data.question;
  },

  deleteQuestion: async (id) => {
    const { data } = await apiClient.delete(`/admin/questions/${id}`);
    return data.data;
  },

  // --- CSV Import ---
  importCsv: async (file, topicId = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (topicId) {
      formData.append('topic_id', topicId);
    }
    const { data } = await apiClient.post('/admin/questions/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.report;
  },
};

export default adminService;
