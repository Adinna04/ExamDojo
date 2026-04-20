import api from './auth';

export const roadmapAPI = {
  getStreams: () => api.get('/roadmap/streams'),
  getSubjects: (streamId) => api.get(`/roadmap/streams/${streamId}/subjects`),
  getTopics: (subjectId) => api.get(`/roadmap/subjects/${subjectId}/topics`),
  getLessons: (topicId) => api.get(`/roadmap/topics/${topicId}/lessons`),
  getLesson: (lessonId) => api.get(`/roadmap/lessons/${lessonId}`)
};
