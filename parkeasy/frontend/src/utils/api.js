import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// If proxy fails with 403, retry directly against backend
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 403 &&
      !originalRequest._retried &&
      !originalRequest.baseURL?.startsWith('http')
    ) {
      originalRequest._retried = true;
      originalRequest.baseURL = 'http://localhost:5000/api';
      return api.request(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;
