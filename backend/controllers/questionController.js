const Question = require('../models/Question');
const Lesson = require('../models/Lesson');
const UserProgress = require('../models/UserProgress');
const User = require('../models/User');
const UserStreak = require('../models/UserStreak');
const DailyQuest = require('../models/DailyQuest');
const { calculateQuizXP, calculateStars, checkLevelUp } = require('../utils/xpCalculator');

// @desc    Get questions for a lesson
// @route   GET /api/questions/lesson/:lessonId
// @access  Private
exports.getQuestionsByLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    const questions = await Question.find({
      lesson: req.params.lessonId,
      isActive: true
    }).select('-correctAnswer -explanation');

    // Shuffle questions
    const shuffled = questions.sort(() => Math.random() - 0.5);
    
    // Limit to lesson's question count
    const limitedQuestions = shuffled.slice(0, lesson.questionsCount);

    res.json({
      success: true,
      questions: limitedQuestions,
      timePerQuestion: 30,
      totalQuestions: limitedQuestions.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/questions/submit
// @access  Private
exports.submitQuiz = async (req, res) => {
  try {
    const { lessonId, answers, timeSpent, comboMax } = req.body;
    
    const lesson = await Lesson.findById(lessonId).populate({
      path: 'topic',
      populate: { path: 'subject', populate: 'stream' }
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Get questions and validate answers
    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    let correctCount = 0;
    const results = [];

    for (const answer of answers) {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      if (!question) continue;

      let isCorrect = false;

      if (question.questionType === 'mcq' || question.questionType === 'truefalse') {
        const correctOption = question.options.find(o => o.isCorrect);
        isCorrect = correctOption && answer.selectedAnswer === correctOption.text;
      } else if (question.questionType === 'msq') {
        const correctOptions = question.options.filter(o => o.isCorrect).map(o => o.text).sort();
        const userAnswers = (answer.selectedAnswer || []).sort();
        isCorrect = JSON.stringify(correctOptions) === JSON.stringify(userAnswers);
      } else if (question.questionType === 'numerical') {
        const tolerance = 0.01;
        const userNum = parseFloat(answer.selectedAnswer);
        const correctNum = parseFloat(question.correctAnswer);
        isCorrect = Math.abs(userNum - correctNum) <= tolerance;
      }

      if (isCorrect) correctCount++;

      // Update question stats
      question.timesAttempted += 1;
      if (isCorrect) question.timesCorrect += 1;
      await question.save();

      results.push({
        questionId: question._id,
        isCorrect,
        correctAnswer: question.questionType === 'numerical' 
          ? question.correctAnswer 
          : question.options.filter(o => o.isCorrect).map(o => o.text),
        explanation: question.explanation,
        userAnswer: answer.selectedAnswer
      });
    }

    const totalQuestions = answers.length;
    const percentage = (correctCount / totalQuestions) * 100;
    
    // Calculate XP with time bonus
    const avgTimePerQuestion = timeSpent / totalQuestions;
    const timeBonus = avgTimePerQuestion < 15 ? 0.2 : avgTimePerQuestion < 20 ? 0.1 : 0;
    const comboBonus = comboMax >= 5 ? 0.1 : 0;
    
    const xpResult = calculateQuizXP(correctCount, totalQuestions, timeBonus + comboBonus);
    const stars = calculateStars(percentage);

    // Update or create user progress
    let progress = await UserProgress.findOne({
      user: req.user.id,
      lesson: lessonId
    });

    const isFirstCompletion = !progress || progress.status !== 'completed';

    if (!progress) {
      progress = new UserProgress({
        user: req.user.id,
        stream: lesson.topic.subject.stream._id,
        subject: lesson.topic.subject._id,
        topic: lesson.topic._id,
        lesson: lessonId
      });
    }

    progress.attempts += 1;
    progress.lastAttemptDate = new Date();
    progress.totalTimeSpent += timeSpent;

    if (percentage >= lesson.passingScore) {
      progress.status = 'completed';
      progress.completedAt = progress.completedAt || new Date();
      if (stars > progress.stars) progress.stars = stars;
      if (percentage > progress.bestScore) progress.bestScore = percentage;
      if (isFirstCompletion) progress.xpEarned = xpResult.totalXP;
    } else {
      progress.status = 'in_progress';
    }

    // Save question attempts
    progress.questionsAttempted = results.map(r => ({
      question: r.questionId,
      isCorrect: r.isCorrect,
      userAnswer: r.userAnswer,
      timeSpent: timeSpent / totalQuestions
    }));

    await progress.save();

    // Update user stats
    const user = await User.findById(req.user.id);
    const oldXP = user.xp;
    
    user.totalQuizzes += 1;
    if (percentage === 100) user.perfectQuizzes += 1;
    user.totalCorrectAnswers += correctCount;
    user.totalAnswers += totalQuestions;
    
    if (isFirstCompletion && percentage >= lesson.passingScore) {
      user.xp += xpResult.totalXP;
      const { level, levelName } = user.calculateLevel();
      user.level = level;
      user.levelName = levelName;
    }
    
    await user.save();

    // Update streak
    const streak = await UserStreak.findOne({ user: req.user.id });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (streak) {
      const lastActivity = streak.lastActivityDate ? new Date(streak.lastActivityDate) : null;
      if (lastActivity) {
        lastActivity.setHours(0, 0, 0, 0);
      }

      if (!lastActivity || lastActivity.getTime() < today.getTime()) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastActivity && lastActivity.getTime() === yesterday.getTime()) {
          streak.currentStreak += 1;
        } else if (!lastActivity || lastActivity.getTime() < yesterday.getTime()) {
          streak.currentStreak = 1;
        }

        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak;
        }

        streak.lastActivityDate = new Date();
        streak.streakHistory.push({
          date: new Date(),
          xpEarned: xpResult.totalXP,
          lessonsCompleted: 1
        });

        await streak.save();

        // Update user streak
        user.currentStreak = streak.currentStreak;
        if (streak.currentStreak > user.longestStreak) {
          user.longestStreak = streak.currentStreak;
        }
        await user.save();
      }
    }

    // Update daily quests
    const dailyQuests = await DailyQuest.find({
      user: req.user.id,
      date: { $gte: today },
      isCompleted: false
    });

    for (const quest of dailyQuests) {
      if (quest.type === 'complete_lessons') {
        quest.progress += 1;
      } else if (quest.type === 'perfect_quiz' && percentage === 100) {
        quest.progress += 1;
      } else if (quest.type === 'combo_streak' && comboMax >= quest.target) {
        quest.progress = quest.target;
      } else if (quest.type === 'answer_correct') {
        quest.progress += correctCount;
      }

      if (quest.progress >= quest.target) {
        quest.isCompleted = true;
      }
      await quest.save();
    }

    const leveledUp = checkLevelUp(oldXP, user.xp);

    res.json({
      success: true,
      results: {
        correct: correctCount,
        total: totalQuestions,
        percentage: percentage.toFixed(1),
        stars,
        xp: isFirstCompletion && percentage >= lesson.passingScore ? xpResult : { totalXP: 0 },
        passed: percentage >= lesson.passingScore,
        isFirstCompletion,
        leveledUp,
        newLevel: leveledUp ? user.level : null,
        newLevelName: leveledUp ? user.levelName : null,
        streak: streak?.currentStreak || 1
      },
      answers: results
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get question by ID (with answer for review)
// @route   GET /api/questions/:id
// @access  Private
exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
