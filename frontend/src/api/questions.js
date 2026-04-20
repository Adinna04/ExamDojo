import api from './auth';

export const questionsAPI = {
  getByLesson: (lessonId) => api.get(`/questions/lesson/${lessonId}`),
  submit: (data) => api.post('/questions/submit', data),
  getQuestion: (id) => api.get(`/questions/${id}`)
};

// Added for Admin Panel makeover
export const getAllQuestions = () => api.get('/admin/questions');
export const addQuestion = (data) => api.post('/admin/questions', data);
export const deleteQuestion = (id) => api.delete(`/admin/questions/${id}`);
export const fetchQuestions = (params) => api.get('/questions', { params });

