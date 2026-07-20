import apiClient from './apiClient';

const profileService = {
  getProfile: async () => {
    const { data } = await apiClient.get('/profile');
    return data.data.user;
  },

  updateProfile: async (fields) => {
    const { data } = await apiClient.put('/profile', fields);
    return data.data.user;
  },

  uploadPhoto: async (photoFile) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    const { data } = await apiClient.post('/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  uploadResume: async (resumeFile) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    const { data } = await apiClient.post('/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },
};

export default profileService;
