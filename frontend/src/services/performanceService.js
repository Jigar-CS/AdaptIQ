import apiClient from './apiClient';

const performanceService = {
  getSummary: async () => {
    const { data } = await apiClient.get('/performance/summary');
    return data.data;
  },

  getByTopic: async () => {
    const { data } = await apiClient.get('/performance/by-topic');
    return data.data;
  },

  getHistory: async (params = {}) => {
    const { data } = await apiClient.get('/performance/history', { params });
    return data.data;
  },

  getRecommendations: async () => {
    const { data } = await apiClient.get('/recommendations');
    return data.data;
  },

  dismissRecommendation: async (id) => {
    const { data } = await apiClient.put(`/recommendations/${id}/dismiss`);
    return data.data;
  },
};

export default performanceService;
