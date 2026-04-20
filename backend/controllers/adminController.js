const User = require('../models/User');
const Stream = require('../models/Stream');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const Question = require('../models/Question');
const Achievement = require('../models/Achievement');

// ============ USERS ============
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, department } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (department) query.department = department;

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { isAdmin, isActive, xp, level } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin, isActive, xp, level },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ STREAMS ============
exports.createStream = async (req, res) => {
  try {
    const stream = await Stream.create(req.body);
    res.status(201).json({ success: true, stream });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStream = async (req, res) => {
  try {
    const stream = await Stream.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, stream });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteStream = async (req, res) => {
  try {
    await Stream.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Stream deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ SUBJECTS ============
exports.createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    
    // Update stream's subject count
    await Stream.findByIdAndUpdate(
      req.body.stream,
      { $inc: { totalSubjects: 1 } }
    );

    res.status(201).json({ success: true, subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, subject });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    await Stream.findByIdAndUpdate(
      subject.stream,
      { $inc: { totalSubjects: -1 } }
    );
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ TOPICS ============
exports.createTopic = async (req, res) => {
  try {
    const topic = await Topic.create(req.body);
    
    await Subject.findByIdAndUpdate(
      req.body.subject,
      { $inc: { totalTopics: 1 } }
    );

    res.status(201).json({ success: true, topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, topic });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    await Subject.findByIdAndUpdate(
      topic.subject,
      { $inc: { totalTopics: -1 } }
    );
    await Topic.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Topic deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ LESSONS ============
exports.createLesson = async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    
    await Topic.findByIdAndUpdate(
      req.body.topic,
      { $inc: { totalLessons: 1 } }
    );

    res.status(201).json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    await Topic.findByIdAndUpdate(
      lesson.topic,
      { $inc: { totalLessons: -1 } }
    );
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Lesson deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ QUESTIONS ============
exports.createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkCreateQuestions = async (req, res) => {
  try {
    const { questions } = req.body;
    const created = await Question.insertMany(questions);
    res.status(201).json({ 
      success: true, 
      count: created.length,
      message: `${created.length} questions created`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const { lesson, topic, subject, stream, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (lesson) query.lesson = lesson;
    if (topic) query.topic = topic;
    if (subject) query.subject = subject;
    if (stream) query.stream = stream;

    const questions = await Question.find(query)
      .populate('lesson', 'title')
      .populate('topic', 'name')
      .populate('subject', 'name')
      .populate('stream', 'name')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Question.countDocuments(query);

    res.json({
      success: true,
      questions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ ACHIEVEMENTS ============
exports.createAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.create(req.body);
    res.status(201).json({ success: true, achievement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, achievement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteAchievement = async (req, res) => {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Achievement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ STATS ============
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      activeUsers: await User.countDocuments({ 
        lastActiveDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      streams: await Stream.countDocuments(),
      subjects: await Subject.countDocuments(),
      topics: await Topic.countDocuments(),
      lessons: await Lesson.countDocuments(),
      questions: await Question.countDocuments(),
      achievements: await Achievement.countDocuments()
    };

    // Users by department
    const usersByDepartment = await User.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    // Recent signups
    const recentSignups = await User.find()
      .select('username email department createdAt')
      .sort('-createdAt')
      .limit(10);

    res.json({
      success: true,
      stats,
      usersByDepartment,
      recentSignups
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
