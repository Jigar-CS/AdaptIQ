import apiClient from './apiClient';

const profileService = {
  getProfile: async () => {
    const { data } = await apiClient.get('/user/profile');
    return data.data.user;
  },

  updateProfile: async (fields) => {
    const { data } = await apiClient.put('/user/profile', fields);
    return data.data.user;
  },

  uploadPhoto: async (photoFile) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    const { data } = await apiClient.post('/user/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  uploadResume: async (resumeFile) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    const { data } = await apiClient.post('/user/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const { data } = await apiClient.put('/user/profile/password', {
      currentPassword,
      newPassword,
    });
    return data;
  },
};

export default profileService;
