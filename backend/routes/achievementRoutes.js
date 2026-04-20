const express = require('express');
const router = express.Router();
const { 
  getAchievements, 
  getUserAchievements,
  checkAchievements 
} = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAchievements);
router.get('/user', getUserAchievements);
router.post('/check', checkAchievements);

module.exports = router;
