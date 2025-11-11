import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.detail || error.response.data?.error || 'Server error';
      error.message = message;
    } else if (error.request) {
      error.message = 'Network Error: No response from server';
    }
    return Promise.reject(error);
  }
);

export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export const calculateEfficiency = async (data) => {
  const response = await apiClient.post('/api/efficiency/calculate', data);
  return response.data;
};

export const getBuildingCalculations = async (buildingId) => {
  const response = await apiClient.get(`/api/efficiency/building/${buildingId}`);
  return response.data;
};

export const getBuildingPeriodCalculations = async (buildingId, period) => {
  const response = await apiClient.get(`/api/efficiency/building/${buildingId}/period/${period}`);
  return response.data;
};

export const getBuildingSummary = async (buildingId) => {
  const response = await apiClient.get(`/api/efficiency/building/${buildingId}/summary`);
  return response.data;
};

export default apiClient;

