const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const UserStreak = require('../models/UserStreak');
const Achievement = require('../models/Achievement');
const DailyQuest = require('../models/DailyQuest');
const { calculateLevel, checkLevelUp } = require('../utils/xpCalculator');

// @desc    Get user by ID
// @route   GET /api/users/:id
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('achievements');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { username, avatar, preferences } = req.body;
    const updateFields = {};
    if (username) updateFields.username = username;
    if (avatar) updateFields.avatar = avatar;
    if (preferences) updateFields.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add XP to user (FIXED FOR NAN ERROR)
// @route   POST /api/users/add-xp
exports.addXP = async (req, res) => {
  try {
    // 1. FIXED: Frontend bhej raha hai 'xpEarned', backend mang raha tha 'xp'
    const { xpEarned, source } = req.body;
    
    // 2. SAFETY: Ensure points is a valid number
    const points = parseInt(xpEarned) || 0;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 3. SAFETY: Database mein agar xp pehle se NaN ho toh use 0 set karein
    if (isNaN(user.xp)) user.xp = 0;

    const oldXP = user.xp;
    user.xp += points;
    
    // Update level using utility
    const { level, levelName } = calculateLevel(user.xp);
    user.level = level;
    user.levelName = levelName;
    
    await user.save();

    // Check for level up
    const leveledUp = checkLevelUp(oldXP, user.xp);

    // Update daily quest progress (XP logic)
    await DailyQuest.updateMany(
      { 
        user: req.user.id, 
        type: 'earn_xp',
        isCompleted: false,
        date: { $gte: new Date().setHours(0, 0, 0, 0) }
      },
      { $inc: { progress: points } }
    );

    // Check and complete quests
    const quests = await DailyQuest.find({
      user: req.user.id,
      isCompleted: false,
      date: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    const completedQuests = [];
    for (const quest of quests) {
      if (quest.progress >= quest.target) {
        quest.isCompleted = true;
        await quest.save();
        completedQuests.push(quest);
      }
    }

    // Check for XP achievements
    const newAchievements = await checkXPAchievements(user);

    res.json({
      success: true,
      xp: user.xp,
      level: user.level,
      levelName: user.levelName,
      leveledUp,
      xpProgress: typeof user.getXPProgress === 'function' ? user.getXPProgress() : 0,
      completedQuests,
      newAchievements
    });
  } catch (error) {
    console.error('Add XP error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user progress
// @route   GET /api/users/progress
exports.getUserProgress = async (req, res) => {
  try {
    const progress = await UserProgress.find({ user: req.user.id })
      .populate('stream subject topic lesson');

    const stats = {
      totalLessonsCompleted: progress.filter(p => p.status === 'completed').length,
      totalStars: progress.reduce((sum, p) => sum + p.stars, 0),
      totalXPEarned: progress.reduce((sum, p) => sum + p.xpEarned, 0),
      totalTimeSpent: progress.reduce((sum, p) => sum + p.totalTimeSpent, 0)
    };

    res.json({ success: true, progress, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user stats
// @route   GET /api/users/stats
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const streak = await UserStreak.findOne({ user: req.user.id });
    const progress = await UserProgress.find({ user: req.user.id });

    const stats = {
      xp: user.xp || 0,
      level: user.level || 1,
      levelName: user.levelName || 'Ninja Novice',
      xpProgress: typeof user.getXPProgress === 'function' ? user.getXPProgress() : 0,
      totalQuizzes: user.totalQuizzes || 0,
      perfectQuizzes: user.perfectQuizzes || 0,
      accuracy: user.totalAnswers > 0 
        ? ((user.totalCorrectAnswers / user.totalAnswers) * 100).toFixed(1)
        : 0,
      streak: streak?.currentStreak || 0,
      longestStreak: streak?.longestStreak || 0,
      lessonsCompleted: progress.filter(p => p.status === 'completed').length,
      totalStars: progress.reduce((sum, p) => sum + p.stars, 0),
      achievements: user.achievements?.length || 0
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Helper function to check XP achievements
async function checkXPAchievements(user) {
  const xpAchievements = await Achievement.find({ 
    type: 'xp',
    _id: { $nin: user.achievements }
  });

  const newAchievements = [];
  for (const achievement of xpAchievements) {
    if (user.xp >= achievement.requirement) {
      user.achievements.push(achievement._id);
      user.xp += achievement.xpReward;
      newAchievements.push(achievement);
    }
  }

  if (newAchievements.length > 0) {
    await user.save();
  }
  return newAchievements;
}

module.exports = exports;