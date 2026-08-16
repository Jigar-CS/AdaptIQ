import apiClient from './apiClient';

/**
 * Note: this portal does not offer per-company (TCS/Infosys/Amazon...) mock tests.
 * There is a single company-level standard mock test, gated by the same
 * dual-condition unlock rule (>=5 Miscellaneous tests AND placement score >= 80).
 */
const companyTestService = {
  getStandardTest: async () => {
    const { data } = await apiClient.get('/company-tests');
    return data.data;
  },

  start: async (testId) => {
    const { data } = await apiClient.post(`/company-tests/${testId}/start`);
    return data.data;
  },

  submitAnswer: async (testId, payload) => {
    const { data } = await apiClient.post(`/company-tests/${testId}/answer`, payload);
    return data.data;
  },

  complete: async (testId) => {
    const { data } = await apiClient.post(`/company-tests/${testId}/complete`);
    return data.data;
  },
};

export default companyTestService;
