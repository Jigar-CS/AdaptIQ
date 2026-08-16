import apiClient from './apiClient';

const placementScoreService = {
  getLatest: async () => {
    const { data } = await apiClient.get('/placement-score');
    return data.data;
  },

  getHistory: async () => {
    const { data } = await apiClient.get('/placement-score/history');
    return data.data;
  },
};

export default placementScoreService;
