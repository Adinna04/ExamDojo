/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';

const XPBar = ({ current, required, level, showLabel = true }) => {
  const percentage = Math.min((current / required) * 100, 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="level-badge w-7 h-7 bg-accent-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-xs font-bold text-white">{level}</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Level {level}</span>
          </div>
          <span className="text-xs text-gray-500">{current}/{required} XP</span>
        </div>
      )}
      
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 xp-bar-shimmer"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default XPBar;
