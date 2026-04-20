/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck, FiAward, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { publicAPI } from '../api/public';

const LandingPage = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStreams: 5, questionsAnswered: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await publicAPI.getStats();
        setStats(response.data.stats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  const features = [
    {
      icon: '🎯',
      title: 'Gamified Learning',
      description: 'Earn XP, level up, and maintain streaks while mastering GATE concepts'
    },
    {
      icon: '🗺️',
      title: 'Structured Roadmap',
      description: 'Follow a clear learning path tailored for your GATE stream'
    },
    {
      icon: '⚡',
      title: 'Timed Quizzes',
      description: 'Practice with real GATE-style questions under exam conditions'
    },
    {
      icon: '🏆',
      title: 'Leaderboards',
      description: 'Compete with fellow aspirants and track your progress'
    }
  ];

  const streams = [
    { name: 'Computer Science', code: 'CS', icon: '💻', color: 'bg-blue-500' },
    { name: 'Electronics', code: 'ECE', icon: '📡', color: 'bg-purple-500' },
    { name: 'Mechanical', code: 'ME', icon: '⚙️', color: 'bg-amber-500' },
    { name: 'Civil', code: 'CE', icon: '🏗️', color: 'bg-green-500' },
    { name: 'Electrical', code: 'EE', icon: '⚡', color: 'bg-red-500' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🎯</span>
            </div>
            <span className="font-heading font-bold text-xl text-gray-800">ExamDojo</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-6">
                <span className="animate-pulse">🔥</span>
                <span>The fun way to crack GATE</span>
              </div>
              
              <h1 className="font-heading text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                Master GATE with
                <span className="text-primary-500 block">Gamified Learning</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Turn your GATE preparation into an engaging adventure. Learn concepts, solve quizzes, 
                earn XP, and compete with thousands of aspirants.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 transition-all hover:shadow-lg flex items-center gap-2"
                >
                  Start Learning Free
                  <FiArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-bold text-lg hover:border-gray-300 transition-all"
                >
                  I have an account
                </Link>
              </div>

              <div className="flex items-center gap-8 mt-10">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}+</p>
                  <p className="text-sm text-gray-500">Active Learners</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{stats.questionsAnswered.toLocaleString()}+</p>
                  <p className="text-sm text-gray-500">Questions Solved</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">5</p>
                  <p className="text-sm text-gray-500">GATE Streams</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Mock dashboard preview */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👨‍💻</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-500">Level 12 • Expert</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-orange-500">
                    <span className="text-xl">🔥</span>
                    <span className="font-bold">15 days</span>
                  </div>
                </div>

                {/* XP Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Progress to Level 13</span>
                    <span className="text-gray-500">350/500 XP</span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[70%] bg-gradient-to-r from-primary-400 to-primary-600 rounded-full relative">
                      <div className="absolute inset-0 xp-bar-shimmer"></div>
                    </div>
                  </div>
                </div>

                {/* Mini roadmap */}
                <div className="space-y-3">
                  {['Arrays ✅', 'Linked Lists ✅', 'Trees 🔓', 'Graphs 🔒'].map((item, i) => (
                    <div 
                      key={i}
                      className={`p-3 rounded-xl border ${
                        i < 2 ? 'bg-primary-50 border-primary-200' : 
                        i === 2 ? 'bg-accent-50 border-accent-200' : 
                        'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <p className="font-medium text-sm">{item}</p>
                    </div>
                  ))}
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-accent-400 text-white px-4 py-2 rounded-xl font-bold shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  +50 XP
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-primary-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  🏆 Rank #42
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
              Why ExamDojo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've combined the best of gaming and education to make GATE prep actually enjoyable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-background rounded-2xl border border-gray-100 card-hover"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Streams Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
              Choose Your Stream
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive preparation for all major GATE disciplines
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {streams.map((stream, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-4 bg-white rounded-2xl border border-gray-200 flex items-center gap-3 cursor-pointer card-hover"
              >
                <div className={`w-12 h-12 ${stream.color} rounded-xl flex items-center justify-center text-2xl text-white`}>
                  {stream.icon}
                </div>
                <div>
                  <p className="font-heading font-bold text-gray-900">{stream.name}</p>
                  <p className="text-sm text-gray-500">{stream.code}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary-500">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl font-bold text-white mb-6">
              Ready to Start Your GATE Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of aspirants who are already learning the fun way
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:bg-primary-50 transition-all shadow-lg"
            >
              Create Free Account
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🎯</span>
            </div>
            <span className="font-heading font-bold text-xl text-white">ExamDojo</span>
          </div>
          <p className="text-sm">
            © 2024 ExamDojo. Made with 💚 for GATE aspirants.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
