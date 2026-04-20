import api from './auth';

export const userAPI = {
  getStats: () => api.get('/users/stats'),
  getProgress: () => api.get('/users/progress'),
  addXP: (xp, source) => api.post('/users/add-xp', { xp, source }),
  updateProfile: (id, data) => api.put(`/users/${id}`, data)
};
