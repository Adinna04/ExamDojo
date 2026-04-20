const Stream = require('../models/Stream');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const UserProgress = require('../models/UserProgress');

// @desc    Get all streams
// @route   GET /api/roadmap/streams
// @access  Private
exports.getStreams = async (req, res) => {
  try {
    const streams = await Stream.find({ isActive: true }).sort('name');
    res.json({ success: true, streams });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get subjects by stream
// @route   GET /api/roadmap/streams/:streamId/subjects
// @access  Private
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ 
      stream: req.params.streamId,
      isActive: true 
    }).sort('order');

    // Get user progress for each subject
    const subjectsWithProgress = await Promise.all(
      subjects.map(async (subject) => {
        const progress = await UserProgress.find({
          user: req.user.id,
          subject: subject._id
        });

        const totalLessons = await Lesson.countDocuments({
          topic: { $in: await Topic.find({ subject: subject._id }).distinct('_id') }
        });

        const completedLessons = progress.filter(p => p.status === 'completed').length;

        return {
          ...subject.toObject(),
          progress: {
            completed: completedLessons,
            total: totalLessons,
            percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
          }
        };
      })
    );

    res.json({ success: true, subjects: subjectsWithProgress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get topics by subject (roadmap nodes)
// @route   GET /api/roadmap/subjects/:subjectId/topics
// @access  Private
exports.getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({
      subject: req.params.subjectId,
      isActive: true
    }).sort('order').populate('prerequisites');

    // Get user progress for each topic
    const topicsWithProgress = await Promise.all(
      topics.map(async (topic, index) => {
        const lessons = await Lesson.find({ topic: topic._id });
        const progress = await UserProgress.find({
          user: req.user.id,
          topic: topic._id
        });

        const completedLessons = progress.filter(p => p.status === 'completed').length;
        const totalStars = progress.reduce((sum, p) => sum + p.stars, 0);
        const maxStars = lessons.length * 3;

        // Determine if topic is unlocked
        let isUnlocked = index === 0; // First topic is always unlocked
        
        if (!isUnlocked && topic.prerequisites.length > 0) {
          // Check if all prerequisites are completed
          const prereqProgress = await UserProgress.find({
            user: req.user.id,
            topic: { $in: topic.prerequisites.map(p => p._id) },
            status: 'completed'
          });
          
          isUnlocked = prereqProgress.length >= topic.prerequisites.length;
        } else if (!isUnlocked && index > 0) {
          // If no prerequisites, check if previous topic has at least one completed lesson
          const prevTopic = topics[index - 1];
          const prevProgress = await UserProgress.find({
            user: req.user.id,
            topic: prevTopic._id,
            status: 'completed'
          });
          isUnlocked = prevProgress.length > 0;
        }

        return {
          ...topic.toObject(),
          lessons: lessons.map(l => ({
            _id: l._id,
            title: l.title,
            type: l.type,
            order: l.order
          })),
          progress: {
            completed: completedLessons,
            total: lessons.length,
            stars: totalStars,
            maxStars,
            percentage: lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0
          },
          isUnlocked,
          isCompleted: completedLessons === lessons.length && lessons.length > 0
        };
      })
    );

    res.json({ success: true, topics: topicsWithProgress });
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get lessons by topic
// @route   GET /api/roadmap/topics/:topicId/lessons
// @access  Private
exports.getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({
      topic: req.params.topicId,
      isActive: true
    }).sort('order');

    const lessonsWithProgress = await Promise.all(
      lessons.map(async (lesson, index) => {
        let progress = await UserProgress.findOne({
          user: req.user.id,
          lesson: lesson._id
        });

        // Determine if lesson is available
        let status = 'locked';
        if (index === 0) {
          status = progress?.status || 'available';
        } else if (progress) {
          status = progress.status;
        } else {
          // Check if previous lesson is completed
          const prevLesson = lessons[index - 1];
          const prevProgress = await UserProgress.findOne({
            user: req.user.id,
            lesson: prevLesson._id,
            status: 'completed'
          });
          if (prevProgress) {
            status = 'available';
          }
        }

        return {
          ...lesson.toObject(),
          status,
          stars: progress?.stars || 0,
          bestScore: progress?.bestScore || 0,
          attempts: progress?.attempts || 0
        };
      })
    );

    res.json({ success: true, lessons: lessonsWithProgress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single lesson details
// @route   GET /api/roadmap/lessons/:lessonId
// @access  Private
exports.getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId)
      .populate({
        path: 'topic',
        populate: {
          path: 'subject',
          populate: 'stream'
        }
      });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    const progress = await UserProgress.findOne({
      user: req.user.id,
      lesson: lesson._id
    });

    res.json({
      success: true,
      lesson: {
        ...lesson.toObject(),
        userProgress: progress || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
