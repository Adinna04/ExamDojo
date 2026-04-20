import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me')
};

export const getDashboardData = () => api.get('/auth/me').then(res => res.data.user);
export const getLeaderboard = (filter) => api.get(`/leaderboard?filter=${filter}`).then(res => res.data.leaderboard);

export default api;