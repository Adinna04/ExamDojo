const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  department: {
    type: String,
    enum: ['CS', 'ECE', 'ME', 'CE', 'EE'],
    required: [true, 'Please select a department']
  },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  levelName: { type: String, default: 'Beginner' },
  isAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastActiveDate: { type: Date, default: Date.now }
}, { timestamps: true });

// --- FIXED: MODERN ASYNC HASHING ---
userSchema.pre('save', async function() {
  // If password isn't modified, Mongoose continues automatically when this async function returns
  if (!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw new Error(err); 
  }
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);