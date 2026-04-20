import api from './auth';

export const leaderboardAPI = {
  get: (params) => api.get('/leaderboard', { params }),
  getRank: () => api.get('/leaderboard/rank')
};
