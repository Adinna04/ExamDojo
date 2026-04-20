const Achievement = require('../models/Achievement');
const User = require('../models/User');

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Private
exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ isActive: true });
    const user = await User.findById(req.user.id);

    const achievementsWithStatus = achievements.map(achievement => ({
      ...achievement.toObject(),
      isUnlocked: user.achievements.includes(achievement._id),
      isSecret: achievement.isSecret && !user.achievements.includes(achievement._id)
    }));

    res.json({
      success: true,
      achievements: achievementsWithStatus,
      unlockedCount: user.achievements.length,
      totalCount: achievements.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user achievements
// @route   GET /api/achievements/user
// @access  Private
exports.getUserAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('achievements');

    res.json({
      success: true,
      achievements: user.achievements
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Check and award achievements
// @route   POST /api/achievements/check
// @access  Private
exports.checkAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const allAchievements = await Achievement.find({
      isActive: true,
      _id: { $nin: user.achievements }
    });

    const newAchievements = [];

    for (const achievement of allAchievements) {
      let qualified = false;

      switch (achievement.type) {
        case 'xp':
          qualified = user.xp >= achievement.requirement;
          break;
        case 'streak':
          qualified = user.currentStreak >= achievement.requirement;
          break;
        case 'quiz':
          qualified = user.totalQuizzes >= achievement.requirement;
          break;
        case 'perfect':
          qualified = user.perfectQuizzes >= achievement.requirement;
          break;
        case 'lesson':
          // Would need to count completed lessons
          break;
      }

      if (qualified) {
        user.achievements.push(achievement._id);
        user.xp += achievement.xpReward;
        newAchievements.push(achievement);
      }
    }

    if (newAchievements.length > 0) {
      user.calculateLevel();
      await user.save();
    }

    res.json({
      success: true,
      newAchievements,
      totalXPAwarded: newAchievements.reduce((sum, a) => sum + a.xpReward, 0)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
