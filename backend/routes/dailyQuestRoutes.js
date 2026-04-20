const express = require('express');
const router = express.Router();
const { getDailyQuests, claimReward } = require('../controllers/dailyQuestController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getDailyQuests);
router.post('/:id/claim', claimReward);

module.exports = router;
