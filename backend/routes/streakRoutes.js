const express = require('express');
const router = express.Router();
const { getStreak, useFreeze, getStreakCalendar } = require('../controllers/streakController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getStreak);
router.post('/freeze', useFreeze);
router.get('/calendar', getStreakCalendar);

module.exports = router;
