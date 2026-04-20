const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  type: {
    type: String,
    enum: ['xp', 'streak', 'quiz', 'perfect', 'combo', 'lesson', 'special'],
    required: true
  },
  requirement: {
    type: Number,
    required: true
  },
  xpReward: {
    type: Number,
    default: 100
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  isSecret: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Achievement', achievementSchema);
