/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    department: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const departments = [
    { code: 'CS', name: 'Computer Science', icon: '💻', color: 'bg-blue-500' },
    { code: 'ECE', name: 'Electronics & Communication', icon: '📡', color: 'bg-purple-500' },
    { code: 'ME', name: 'Mechanical Engineering', icon: '⚙️', color: 'bg-amber-500' },
    { code: 'CE', name: 'Civil Engineering', icon: '🏗️', color: 'bg-green-500' },
    { code: 'EE', name: 'Electrical Engineering', icon: '⚡', color: 'bg-red-500' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDepartmentSelect = (code) => {
    setFormData({ ...formData, department: code });
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (formData.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async () => {
    if (!formData.department) {
      toast.error('Please select a department');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      toast.success('Welcome to ExamDojo! 🎯');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🎯</span>
            </div>
            <span className="font-heading font-bold text-xl text-gray-800">ExamDojo</span>
          </Link>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-primary-500' : 'bg-gray-200'}`} />
            <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`} />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
                  Create your account
                </h1>
                <p className="text-gray-600 mb-8">
                  Start your GATE preparation journey today
                </p>

                <form onSubmit={handleStep1Submit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="johndoe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                  >
                    Continue
                    <FiArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
                  Select your stream
                </h1>
                <p className="text-gray-600 mb-8">
                  Choose the GATE stream you're preparing for
                </p>

                <div className="grid gap-3 mb-8">
                  {departments.map((dept) => (
                    <motion.button
                      key={dept.code}
                      type="button"
                      onClick={() => handleDepartmentSelect(dept.code)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                        formData.department === dept.code
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-12 h-12 ${dept.color} rounded-xl flex items-center justify-center text-2xl text-white`}>
                        {dept.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-900">{dept.name}</p>
                        <p className="text-sm text-gray-500">GATE {dept.code}</p>
                      </div>
                      {formData.department === dept.code && (
                        <div className="ml-auto w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

                <button
                  onClick={handleFinalSubmit}
                  disabled={loading || !formData.department}
                  className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Start Learning
                      <FiArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Decoration */}
      <div className="hidden lg:flex flex-1 bg-primary-500 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-white"
        >
          <div className="text-8xl mb-8 float-animation">🚀</div>
          <h2 className="font-heading text-3xl font-bold mb-4">
            Your GATE journey starts here
          </h2>
          <p className="text-primary-100 text-lg max-w-sm">
            Join thousands of aspirants mastering concepts through gamified learning
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
