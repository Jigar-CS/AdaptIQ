import apiClient from './apiClient';

const topicService = {
  getTopics: async () => {
    const { data } = await apiClient.get('/topics');
    return data.data.topics;
  },
};

export default topicService;
