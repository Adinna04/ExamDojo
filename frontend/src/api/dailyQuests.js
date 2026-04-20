import api from './auth';

export const dailyQuestsAPI = {
  get: () => api.get('/daily-quests'),
  claim: (id) => api.post(`/daily-quests/${id}/claim`)
};
