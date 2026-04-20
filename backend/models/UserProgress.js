const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stream',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  status: {
    type: String,
    enum: ['locked', 'available', 'in_progress', 'completed'],
    default: 'locked'
  },
  stars: {
    type: Number,
    min: 0,
    max: 3,
    default: 0
  },
  bestScore: {
    type: Number,
    default: 0
  },
  attempts: {
    type: Number,
    default: 0
  },
  totalTimeSpent: {
    type: Number, // in seconds
    default: 0
  },
  lastAttemptDate: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  xpEarned: {
    type: Number,
    default: 0
  },
  questionsAttempted: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    isCorrect: Boolean,
    userAnswer: mongoose.Schema.Types.Mixed,
    timeSpent: Number,
    attemptedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Compound index for unique progress per user per lesson
userProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
