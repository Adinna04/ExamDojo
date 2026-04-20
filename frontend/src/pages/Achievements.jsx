/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiLock, FiCheckCircle, FiStar } from 'react-icons/fi';
import { achievementsAPI } from '../api/achievements';
import toast from 'react-hot-toast';

const Achievements = () => {
  const [data, setData] = useState({ 
    achievements: [], 
    unlockedCount: 0, 
    totalCount: 0 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await achievementsAPI.getAll();
        setData(response.data);
      } catch (error) {
        toast.error("The scrolls of honor couldn't be unrolled.");
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  if (loading) return (
    <div className="p-20 text-center font-black text-primary-500 animate-pulse tracking-tighter">
      UNROLLING THE SCROLLS OF HONOR...
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <FiAward className="text-primary-500" /> Hall of Fame
          </h1>
          <p className="text-slate-500 font-medium mt-1">Track your milestones and unique titles.</p>
        </motion.div>
        
        <div className="bg-white px-6 py-3 rounded-2xl border-2 border-slate-100 font-black text-primary-600 shadow-sm">
          {data.unlockedCount} / {data.totalCount} UNLOCKED
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.achievements.map((ach, index) => (
          <motion.div
            key={ach._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className={`p-6 rounded-[2rem] border-2 border-b-8 transition-all ${
              ach.isUnlocked 
                ? 'bg-white border-primary-100 shadow-xl' 
                : 'bg-slate-50 border-slate-100 opacity-60 grayscale'
            }`}
          >
            <div className="text-5xl mb-4">{ach.isUnlocked ? ach.icon : '🔒'}</div>
            <h3 className="text-xl font-black text-slate-800">{ach.name}</h3>
            <p className="text-slate-500 text-sm mt-1">{ach.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;