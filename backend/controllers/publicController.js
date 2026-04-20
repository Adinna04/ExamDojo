const Stream = require('../models/Stream');
const User = require('../models/User');

// @desc    Get public stats
// @route   GET /api/public/stats
// @access  Public
exports.getPublicStats = async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments({ isActive: true }),
      totalStreams: await Stream.countDocuments({ isActive: true }),
      questionsAnswered: await User.aggregate([
        { $group: { _id: null, total: { $sum: '$totalAnswers' } } }
      ]).then(r => r[0]?.total || 0)
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get available streams (public)
// @route   GET /api/public/streams
// @access  Public
exports.getPublicStreams = async (req, res) => {
  try {
    const streams = await Stream.find({ isActive: true })
      .select('name code description icon color');
    
    res.json({ success: true, streams });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
