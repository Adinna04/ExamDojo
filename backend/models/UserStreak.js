const mongoose = require('mongoose');

const userStreakSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: null
  },
  streakHistory: [{
    date: Date,
    xpEarned: Number,
    lessonsCompleted: Number
  }],
  freezesAvailable: {
    type: Number,
    default: 2
  },
  freezeUsedToday: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserStreak', userStreakSchema);
