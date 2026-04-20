const express = require('express');
const router = express.Router();
const { 
  getQuestionsByLesson,
  submitQuiz,
  getQuestion
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/lesson/:lessonId', getQuestionsByLesson);
router.post('/submit', submitQuiz);
router.get('/:id', getQuestion);

module.exports = router;
