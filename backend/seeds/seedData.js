const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Stream = require('../models/Stream');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const Question = require('../models/Question');
const Achievement = require('../models/Achievement');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Stream.deleteMany({});
    await Subject.deleteMany({});
    await Topic.deleteMany({});
    await Lesson.deleteMany({});
    await Question.deleteMany({});
    await Achievement.deleteMany({});

    console.log('🧹 Cleared existing data');

    // 1. Create Streams
    const streams = await Stream.insertMany([
      { name: 'Computer Science', code: 'CS', slug: 'cs', description: 'CS & IT', icon: '💻', color: '#3b82f6' },
      { name: 'Electronics', code: 'ECE', slug: 'ece', description: 'ECE Engineering', icon: '📡', color: '#8b5cf6' },
      { name: 'Mechanical', code: 'ME', slug: 'me', description: 'ME Engineering', icon: '⚙️', color: '#f59e0b' },
      { name: 'Civil', code: 'CE', slug: 'ce', description: 'CE Engineering', icon: '🏗️', color: '#10b981' },
      { name: 'Electrical', code: 'EE', slug: 'ee', description: 'EE Engineering', icon: '⚡', color: '#ef4444' }
    ]);
    console.log('💎 Created streams');

    const csStream = streams.find(s => s.code === 'CS');

    // 2. Create Subjects (matching model fields)
    const subjects = await Subject.insertMany([
      {
        name: 'Data Structures & Algorithms',
        code: 'DSA',
        slug: 'dsa',
        stream: csStream._id,
        streamId: csStream._id, // Added to satisfy potential index requirements
        description: 'Fundamentals of DSA',
        icon: '🌳',
        color: '#16a34a',
        order: 1
      },
      {
        name: 'Operating Systems',
        code: 'OS',
        slug: 'os',
        stream: csStream._id,
        streamId: csStream._id,
        description: 'Core OS concepts',
        icon: '🖥️',
        color: '#2563eb',
        order: 2
      }
    ]);
    console.log('📚 Created subjects');

    const dsaSubject = subjects.find(s => s.code === 'DSA');

    // 3. Create Topics
    const topics = await Topic.insertMany([
      {
        name: 'Arrays',
        code: 'ARRAYS',
        slug: 'arrays',
        subject: dsaSubject._id,
        subjectId: dsaSubject._id, // Added to satisfy potential index requirements
        description: 'Array operations',
        order: 1,
        difficulty: 'easy',
        estimatedTime: 45,
        xpReward: 100
      }
    ]);
    console.log('📍 Created topics');

    const arraysTopic = topics.find(t => t.code === 'ARRAYS');

    // 4. Create Lesson
    const lessons = await Lesson.insertMany([
      {
        title: 'Introduction to Arrays',
        topic: arraysTopic._id,
        order: 1,
        type: 'theory',
        content: 'Basics of arrays.',
        duration: 10,
        xpReward: 20,
        questionsCount: 5,
        passingScore: 60
      }
    ]);
    console.log('📖 Created lessons');

    // 5. Create Questions
    const firstLesson = lessons[0];
    await Question.insertMany([
      {
        lesson: firstLesson._id,
        topic: arraysTopic._id,
        subject: dsaSubject._id,
        stream: csStream._id,
        questionText: 'Time complexity of index access?',
        questionType: 'mcq',
        options: [
          { text: 'O(1)', isCorrect: true },
          { text: 'O(n)', isCorrect: false }
        ],
        explanation: 'Arrays have O(1) access.',
        difficulty: 'easy',
        marks: 1,
        timeLimit: 30
      }
    ]);
    console.log('❓ Created questions');

    // 6. Create Admin
    const adminEmail = 'admin@examdojo.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: adminEmail,
        password: 'admin123',
        department: 'CS',
        isAdmin: true
      });
      console.log('👤 Created admin user');
    }

    console.log('\n✅ SEEDING COMPLETE! You are ready to log in.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();