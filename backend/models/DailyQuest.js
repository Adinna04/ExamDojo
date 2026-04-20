const mongoose = require('mongoose');

const dailyQuestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['complete_lessons', 'perfect_quiz', 'earn_xp', 'combo_streak', 'answer_correct'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  target: {
    type: Number,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  xpReward: {
    type: Number,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isClaimed: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

dailyQuestSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('DailyQuest', dailyQuestSchema);
