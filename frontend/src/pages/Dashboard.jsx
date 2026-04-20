/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FiBook, FiClock, FiCheck, FiTrendingUp, 
  FiAward, FiPlay, FiCloud, FiZap, FiTarget 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import DailyQuests from '../components/DailyQuests';
import StreakCounter from '../components/StreakCounter';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);

  // --- Assignment 6: Fetching Weather Data (Pune) ---
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/public/weather/Pune');
        if (res.data.success) {
          setWeather(res.data.data);
        }
      } catch (err) {
        console.error("Weather Widget Error:", err);
      }
    };
    if (user) fetchWeather();
  }, [user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-8 border-primary-500 border-t-transparent shadow-xl"></div>
        <p className="font-black text-slate-400 tracking-widest animate-pulse uppercase">Syncing Dojo...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16 px-4">
      
      {/* --- PLAYER HEADER SECTION --- */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-6">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          {/* Gamified Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-[2rem] bg-white border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center text-4xl font-black text-primary-500 transition-transform group-hover:rotate-6">
              {user?.profilePicture ? (
                <img src={`http://localhost:5000${user.profilePicture}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.username?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="absolute -bottom-3 -right-3 bg-slate-900 text-yellow-400 px-3 py-1 rounded-xl border-4 border-white font-black text-sm shadow-lg">
              LVL {user?.level || 1}
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-black text-gray-900 leading-tight">
              Welcome back, <span className="text-primary-600">{user?.username || 'Warrior'}</span>! 👋
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
               <StreakCounter streak={user?.streak?.current || 0} />
               {weather && (
                 <div className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border-2 border-slate-100 font-bold text-slate-500 text-xs shadow-sm">
                   <FiCloud className="text-blue-400" /> {weather.temp} in {weather.city}
                 </div>
               )}
            </div>
          </div>
        </motion.div>
        
        {/* Quick View Stats */}
        <div className="flex gap-4">
           <div className="bg-white px-6 py-4 rounded-[2rem] border-b-8 border-slate-100 flex flex-col items-center">
              <span className="text-xs font-black text-slate-400 uppercase">Total XP</span>
              <span className="text-2xl font-black text-slate-800">{user?.xp || 0}</span>
           </div>
           <div className="bg-white px-6 py-4 rounded-[2rem] border-b-8 border-slate-100 flex flex-col items-center">
              <span className="text-xs font-black text-slate-400 uppercase">Rank</span>
              <span className="text-2xl font-black text-primary-500">#{user?.globalRank || '-'}</span>
           </div>
        </div>
      </header>

      {/* --- XP PROGRESS BAR (DUOLINGO STYLE) --- */}
      <div className="bg-white p-8 rounded-[2.5rem] border-2 border-b-8 border-slate-100 shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest">XP Progress to Level { (user?.level || 1) + 1 }</h3>
          <p className="font-black text-primary-600 text-xl">{user?.xp % 1000} / 1000 <span className="text-xs text-slate-400">XP</span></p>
        </div>
        <div className="h-6 bg-slate-100 rounded-2xl p-1 border-2 border-slate-50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(user?.xp % 1000) / 10}%` }}
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </motion.div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Featured Mission Card */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl group border-b-[12px] border-slate-800"
          >
            <div className="relative z-10 space-y-4">
              <span className="inline-block bg-primary-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Active Mission</span>
              <h2 className="text-5xl font-black leading-tight max-w-sm">Ready to battle in {user?.department}?</h2>
              <p className="text-slate-400 font-bold max-w-xs opacity-90 text-lg">Continue your learning path and unlock secret rewards!</p>
              <Link 
                to="/streams"
                className="inline-flex items-center gap-3 px-10 py-5 bg-primary-500 text-white rounded-[2rem] font-black hover:bg-primary-600 hover:scale-105 transition-all shadow-xl shadow-primary-500/20 mt-6"
              >
                <FiPlay className="fill-current" /> START BATTLE
              </Link>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-[-10%] right-[-5%] text-[22rem] opacity-10 rotate-12 select-none pointer-events-none group-hover:rotate-[20deg] transition-transform">⚔️</div>
          </motion.div>

          <DailyQuests />
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-10">
          {/* Trophies Widget */}
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-b-8 border-slate-100 shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
              <FiAward className="text-yellow-500" /> Recent Trophies
            </h3>
            {user?.achievements?.length > 0 ? (
              <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                <div className="text-6xl mb-4 drop-shadow-lg">{user.achievements[0].icon}</div>
                <h4 className="font-black text-slate-800 text-lg">{user.achievements[0].name}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase mt-1">{user.achievements[0].description}</p>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-4xl opacity-20 mb-2">🔒</p>
                <p className="text-sm text-slate-400 font-black uppercase">No Trophies Unlocked</p>
              </div>
            )}
            <Link to="/achievements" className="block text-center mt-8 text-sm font-black text-primary-500 hover:underline tracking-widest uppercase">
              Enter Hall of Fame
            </Link>
          </div>

          {/* Stats Radar Widget */}
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-b-8 border-slate-100 shadow-sm">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
              <FiTarget className="text-primary-500" /> Combat Stats
            </h3>
            <div className="space-y-5">
               <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-400 uppercase">Accuracy</span>
                  <span className="text-xl font-black text-slate-800">
                    {user?.totalAnswers > 0 ? ((user.totalCorrectAnswers / user.totalAnswers) * 100).toFixed(0) : 0}%
                  </span>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-400 uppercase">Global Rank</span>
                  <span className="text-xl font-black text-primary-500">#{user?.globalRank || '-'}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;