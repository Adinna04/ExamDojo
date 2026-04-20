const express = require('express');
const router = express.Router();
const { getLeaderboard, getUserRank } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getLeaderboard);
router.get('/rank', getUserRank);

module.exports = router;
