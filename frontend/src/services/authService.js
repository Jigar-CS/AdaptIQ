import apiClient from './apiClient';

const authService = {
  register: async (name, email, password) => {
    const { data } = await apiClient.post('/auth/register', { name, email, password });
    return data.data;
  },

  login: async (email, password) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data.data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  getProfile: async () => {
    const { data } = await apiClient.get('/profile');
    return data.data.user;
  },
};

export default authService;
