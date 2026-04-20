const User = require('../models/User');

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res) => {
  try {
    const { filter = 'alltime', department, limit = 50 } = req.query;

    let dateFilter = {};
    const now = new Date();

    if (filter === 'weekly') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { lastActiveDate: { $gte: weekAgo } };
    } else if (filter === 'monthly') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { lastActiveDate: { $gte: monthAgo } };
    }

    let query = { isActive: true, ...dateFilter };
    if (department) {
      query.department = department;
    }

    const users = await User.find(query)
      .select('username avatar xp level levelName department currentStreak')
      .sort('-xp')
      .limit(parseInt(limit));

    // Add rank to each user
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      username: user.username,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      levelName: user.levelName,
      department: user.department,
      streak: user.currentStreak
    }));

    // Get current user's rank
    const currentUserRank = await User.countDocuments({
      ...query,
      xp: { $gt: req.user.xp }
    }) + 1;

    res.json({
      success: true,
      leaderboard,
      userRank: currentUserRank,
      filter,
      total: await User.countDocuments(query)
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user rank
// @route   GET /api/leaderboard/rank
// @access  Private
exports.getUserRank = async (req, res) => {
  try {
    const rank = await User.countDocuments({
      isActive: true,
      xp: { $gt: req.user.xp }
    }) + 1;

    const total = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      rank,
      total,
      percentile: (((total - rank) / total) * 100).toFixed(1)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
