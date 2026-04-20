const UserStreak = require('../models/UserStreak');
const User = require('../models/User');

// @desc    Get user streak
// @route   GET /api/streaks
// @access  Private
exports.getStreak = async (req, res) => {
  try {
    let streak = await UserStreak.findOne({ user: req.user.id });
    
    if (!streak) {
      streak = await UserStreak.create({ user: req.user.id });
    }

    res.json({
      success: true,
      streak: {
        current: streak.currentStreak,
        longest: streak.longestStreak,
        lastActivity: streak.lastActivityDate,
        freezesAvailable: streak.freezesAvailable,
        history: streak.streakHistory.slice(-30) // Last 30 days
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Use streak freeze
// @route   POST /api/streaks/freeze
// @access  Private
exports.useFreeze = async (req, res) => {
  try {
    const streak = await UserStreak.findOne({ user: req.user.id });

    if (!streak) {
      return res.status(404).json({
        success: false,
        message: 'Streak record not found'
      });
    }

    if (streak.freezesAvailable <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No freezes available'
      });
    }

    if (streak.freezeUsedToday) {
      return res.status(400).json({
        success: false,
        message: 'Freeze already used today'
      });
    }

    streak.freezesAvailable -= 1;
    streak.freezeUsedToday = true;
    streak.lastActivityDate = new Date();
    await streak.save();

    res.json({
      success: true,
      message: 'Streak freeze applied',
      freezesRemaining: streak.freezesAvailable
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get streak calendar
// @route   GET /api/streaks/calendar
// @access  Private
exports.getStreakCalendar = async (req, res) => {
  try {
    const streak = await UserStreak.findOne({ user: req.user.id });
    
    if (!streak) {
      return res.json({ success: true, calendar: [] });
    }

    // Get last 30 days activity
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const calendar = streak.streakHistory
      .filter(h => new Date(h.date) >= thirtyDaysAgo)
      .map(h => ({
        date: h.date,
        xpEarned: h.xpEarned,
        lessonsCompleted: h.lessonsCompleted
      }));

    res.json({ success: true, calendar });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
