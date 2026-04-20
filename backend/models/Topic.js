const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  estimatedTime: {
    type: Number, // in minutes
    default: 30
  },
  totalLessons: {
    type: Number,
    default: 0
  },
  xpReward: {
    type: Number,
    default: 100
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

topicSchema.index({ code: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Topic', topicSchema);
