const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    enum: ['CS', 'ECE', 'ME', 'CE', 'EE']
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '📚'
  },
  color: {
    type: String,
    default: '#16a34a'
  },
  totalSubjects: {
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

module.exports = mongoose.model('Stream', streamSchema);
