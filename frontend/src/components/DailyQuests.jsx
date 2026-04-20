/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiGift } from 'react-icons/fi';
import { dailyQuestsAPI } from '../api/dailyQuests';
import toast from 'react-hot-toast';

const DailyQuests = ({ onUpdate }) => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      const response = await dailyQuestsAPI.get();
      setQuests(response.data.quests);
    } catch (error) {
      console.error('Failed to fetch quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (questId) => {
    try {
      const response = await dailyQuestsAPI.claim(questId);
      toast.success(`+${response.data.xpAwarded} XP claimed!`);
      
      setQuests(prev => 
        prev.map(q => 
          q._id === questId ? { ...q, isClaimed: true } : q
        )
      );
      
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to claim reward');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-heading font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-xl">📋</span>
        Daily Quests
      </h3>
      
      <div className="space-y-3">
        <AnimatePresence>
          {quests.map((quest) => (
            <motion.div
              key={quest._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border transition-all ${
                quest.isCompleted
                  ? quest.isClaimed
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-primary-50 border-primary-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    quest.isClaimed ? 'text-gray-400 line-through' : 'text-gray-700'
                  }`}>
                    {quest.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    {/* Progress bar */}
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          quest.isCompleted ? 'bg-primary-500' : 'bg-accent-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((quest.progress / quest.target) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {quest.progress}/{quest.target}
                    </span>
                  </div>
                </div>
                
                <div className="ml-4">
                  {quest.isClaimed ? (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <FiCheck className="w-5 h-5 text-gray-400" />
                    </div>
                  ) : quest.isCompleted ? (
                    <button
                      onClick={() => handleClaim(quest._id)}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium
                      hover:bg-primary-600 transition-colors flex items-center gap-2"
                    >
                      <FiGift className="w-4 h-4" />
                      +{quest.xpReward} XP
                    </button>
                  ) : (
                    <div className="px-3 py-2 bg-accent-100 text-accent-700 rounded-lg text-sm font-medium">
                      +{quest.xpReward} XP
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DailyQuests;
