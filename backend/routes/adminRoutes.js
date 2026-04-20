const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

// Dashboard
router.get('/stats', admin.getDashboardStats);

// Users
router.get('/users', admin.getAllUsers);
router.put('/users/:id', admin.updateUser);
router.delete('/users/:id', admin.deleteUser);

// Streams
router.post('/streams', admin.createStream);
router.put('/streams/:id', admin.updateStream);
router.delete('/streams/:id', admin.deleteStream);

// Subjects
router.post('/subjects', admin.createSubject);
router.put('/subjects/:id', admin.updateSubject);
router.delete('/subjects/:id', admin.deleteSubject);

// Topics
router.post('/topics', admin.createTopic);
router.put('/topics/:id', admin.updateTopic);
router.delete('/topics/:id', admin.deleteTopic);

// Lessons
router.post('/lessons', admin.createLesson);
router.put('/lessons/:id', admin.updateLesson);
router.delete('/lessons/:id', admin.deleteLesson);

// Questions
router.get('/questions', admin.getQuestions);
router.post('/questions', admin.createQuestion);
router.post('/questions/bulk', admin.bulkCreateQuestions);
router.put('/questions/:id', admin.updateQuestion);
router.delete('/questions/:id', admin.deleteQuestion);

// Achievements
router.post('/achievements', admin.createAchievement);
router.put('/achievements/:id', admin.updateAchievement);
router.delete('/achievements/:id', admin.deleteAchievement);

module.exports = router;
