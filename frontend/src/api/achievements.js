import api from './auth';

export const achievementsAPI = {
  getAll: () => api.get('/achievements'),
  getUserAchievements: () => api.get('/achievements/user'),
  check: () => api.post('/achievements/check')
};