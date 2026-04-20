const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { protect } = require('../middleware/authMiddleware')

router.get('/', protect, async (req, res) => {
  try {
    const { filter = 'weekly' } = req.query

    const sortField = filter === 'monthly' ? 'monthlyXp'
      : filter === 'alltime' ? 'xp'
      : 'weeklyXp'

    const users = await User.find({})
      .sort({ [sortField]: -1 })
      .limit(50)
      .select('name xp weeklyXp monthlyXp streak level examType')

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      initials: user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      xp: filter === 'monthly' ? (user.monthlyXp || 0)
        : filter === 'alltime' ? (user.xp || 0)
        : (user.weeklyXp || 0),
      streak: user.streak || 0,
      level: user.level || 1,
      examType: user.examType || 'GATE',
    }))

    res.json(leaderboard)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router