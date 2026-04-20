const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  stream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stream',
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '📖'
  },
  color: {
    type: String,
    default: '#16a34a'
  },
  order: {
    type: Number,
    default: 0
  },
  totalTopics: {
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

// Compound index for unique subject per stream
subjectSchema.index({ code: 1, stream: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
