/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';

const LevelBadge = ({ level, levelName, size = 'default' }) => {
  const sizes = {
    small: 'w-8 h-8 text-sm',
    default: 'w-12 h-12 text-lg',
    large: 'w-20 h-20 text-2xl'
  };

  const colors = {
    Beginner: 'from-gray-400 to-gray-500',
    Scholar: 'from-blue-400 to-blue-600',
    Expert: 'from-purple-400 to-purple-600',
    Champion: 'from-amber-400 to-amber-600',
    Master: 'from-rose-400 to-rose-600',
    Grandmaster: 'from-violet-500 to-fuchsia-600'
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', bounce: 0.5 }}
    >
      <div
        className={`${sizes[size]} rounded-full bg-gradient-to-br ${colors[levelName] || colors.Beginner} 
        flex items-center justify-center shadow-lg level-badge`}
      >
        <span className="font-bold text-white drop-shadow">{level}</span>
      </div>
      {size !== 'small' && (
        <span className="text-xs font-medium text-gray-600">{levelName}</span>
      )}
    </motion.div>
  );
};

export default LevelBadge;
