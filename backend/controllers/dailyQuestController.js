const DailyQuest = require('../models/DailyQuest');
const User = require('../models/User');

// @desc    Get user's daily quests
// @route   GET /api/daily-quests
// @access  Private
exports.getDailyQuests = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let quests = await DailyQuest.find({
      user: req.user.id,
      date: { $gte: today }
    });

    // Generate quests if none exist for today
    if (quests.length === 0) {
      const questTemplates = [
        { type: 'complete_lessons', target: 3, xpReward: 50, description: 'Complete 3 lessons' },
        { type: 'perfect_quiz', target: 1, xpReward: 75, description: 'Get 100% on a quiz' },
        { type: 'earn_xp', target: 100, xpReward: 30, description: 'Earn 100 XP' },
        { type: 'combo_streak', target: 5, xpReward: 40, description: 'Get a 5x combo streak' },
        { type: 'answer_correct', target: 20, xpReward: 35, description: 'Answer 20 questions correctly' }
      ];

      const shuffled = questTemplates.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);

      for (const template of selected) {
        await DailyQuest.create({
          user: req.user.id,
          ...template,
          date: today
        });
      }

      quests = await DailyQuest.find({
        user: req.user.id,
        date: { $gte: today }
      });
    }

    res.json({
      success: true,
      quests,
      allCompleted: quests.every(q => q.isCompleted),
      totalXPAvailable: quests.reduce((sum, q) => sum + (q.isClaimed ? 0 : q.xpReward), 0)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Claim quest reward
// @route   POST /api/daily-quests/:id/claim
// @access  Private
exports.claimReward = async (req, res) => {
  try {
    const quest = await DailyQuest.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      });
    }

    if (!quest.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Quest not completed yet'
      });
    }

    if (quest.isClaimed) {
      return res.status(400).json({
        success: false,
        message: 'Reward already claimed'
      });
    }

    quest.isClaimed = true;
    await quest.save();

    // Add XP to user
    const user = await User.findById(req.user.id);
    user.xp += quest.xpReward;
    user.calculateLevel();
    await user.save();

    res.json({
      success: true,
      xpAwarded: quest.xpReward,
      newXP: user.xp,
      newLevel: user.level
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
