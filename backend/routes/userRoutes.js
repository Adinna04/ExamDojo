const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getUser, 
  updateUser, 
  addXP, 
  getUserProgress,
  getUserStats 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Sabhi user routes protected hain
router.use(protect);

// --- ASSIGNMENT 7: MULTER CONFIGURATION ---

// 1. Storage setup (File kahan aur kis naam se save hogi)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Is folder ko manually create karna zaruri hai
  },
  filename: (req, file, cb) => {
    // Unique filename: profile-userid-timestamp.jpg
    cb(null, `profile-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// 2. File Filter (Sirf images allow karne ke liye)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const isMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isMimeMatch = allowedTypes.test(file.mimetype);

  if (isMatch && isMimeMatch) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpg, jpeg, png) are allowed!'), false);
  }
};

const upload = multer({ 
  storage, 
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB Limit
  fileFilter 
});

// --- ROUTES ---

/**
 * @desc    Assignment 7: Upload Profile Picture
 * @route   POST /api/users/profile-picture
 */
router.post('/profile-picture', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image to upload' });
  }

  // Frontend ke liye path return kar rahe hain
  res.json({
    success: true,
    message: 'Profile picture uploaded successfully!',
    filePath: `/uploads/${req.file.filename}`
  });
});

// Existing Routes
router.get('/stats', getUserStats);
router.get('/progress', getUserProgress);
router.post('/add-xp', addXP);
router.route('/:id')
  .get(getUser)
  .put(updateUser);

module.exports = router;