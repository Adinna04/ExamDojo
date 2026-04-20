const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['theory', 'practice', 'quiz', 'challenge'],
    default: 'theory'
  },
  content: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // in minutes
    default: 15
  },
  xpReward: {
    type: Number,
    default: 25
  },
  questionsCount: {
    type: Number,
    default: 10
  },
  passingScore: {
    type: Number,
    default: 60
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lesson', lessonSchema);
