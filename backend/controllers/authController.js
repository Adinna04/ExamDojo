const User = require('../models/User');
const UserStreak = require('../models/UserStreak');

// @desc    Register user
exports.register = async (req, res) => {
  try {
    const { username, email, password, department } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    const user = await User.create({ username, email, password, department });
    await UserStreak.create({ user: user._id });

    const token = user.getSignedJwtToken();
    res.status(201).json({
      success: true,
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        isAdmin: user.isAdmin 
      }
    });
  } catch (error) {
    console.error("Reg Error:", error);
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

// @desc    Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // We select('+password') because it's hidden by default in the model
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    user.lastActiveDate = new Date();
    
    /**
     * CRITICAL: Using validateBeforeSave: false allows the save to bypass 
     * Mongoose validation. This is vital if you manually edited the user
     * in MongoDB Atlas (like changing isAdmin) which might cause strict 
     * validation to fail.
     */
    await user.save({ validateBeforeSave: false });

    const token = user.getSignedJwtToken();
    res.json({
      success: true,
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        isAdmin: user.isAdmin,
        department: user.department 
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const streak = await UserStreak.findOne({ user: req.user.id });
    res.json({
      success: true,
      user: {
        ...user.toObject(),
        streak: streak ? { current: streak.currentStreak, longest: streak.longestStreak } : { current: 0, longest: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};