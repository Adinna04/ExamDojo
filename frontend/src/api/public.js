import api from './auth';

export const publicAPI = {
  getStats: () => api.get('/public/stats'),
  getStreams: () => api.get('/public/streams')
};

// Keep your existing fetch fallback if you prefer, 
// but the line above fixes the import error.