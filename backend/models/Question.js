const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  stream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stream',
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ['mcq', 'msq', 'numerical', 'truefalse'],
    default: 'mcq'
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed // For numerical answers
  },
  explanation: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  marks: {
    type: Number,
    default: 1
  },
  negativeMarks: {
    type: Number,
    default: 0.33
  },
  timeLimit: {
    type: Number, // in seconds
    default: 30
  },
  tags: [{
    type: String
  }],
  yearAsked: {
    type: Number // GATE year if previous year question
  },
  timesAttempted: {
    type: Number,
    default: 0
  },
  timesCorrect: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for success rate
questionSchema.virtual('successRate').get(function() {
  if (this.timesAttempted === 0) return 0;
  return ((this.timesCorrect / this.timesAttempted) * 100).toFixed(1);
});

questionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Question', questionSchema);
