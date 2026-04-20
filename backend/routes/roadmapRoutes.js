const express = require('express');
const router = express.Router();
const { 
  getStreams,
  getSubjects,
  getTopics,
  getLessons,
  getLesson
} = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/streams', getStreams);
router.get('/streams/:streamId/subjects', getSubjects);
router.get('/subjects/:subjectId/topics', getTopics);
router.get('/topics/:topicId/lessons', getLessons);
router.get('/lessons/:lessonId', getLesson);

module.exports = router;
