/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { FiLock, FiCheck, FiStar } from 'react-icons/fi';

const RoadmapNode = ({ 
  topic, 
  index, 
  onClick, 
  isActive = false 
}) => {
  const { name, progress, isUnlocked, isCompleted, difficulty } = topic;
  
  // Zigzag positioning
  const isLeft = index % 2 === 0;
  
  const getStatusStyles = () => {
    if (!isUnlocked) {
      return 'bg-gray-100 border-gray-300 text-gray-400';
    }
    if (isCompleted) {
      return 'bg-primary-50 border-primary-400 text-primary-700';
    }
    return 'bg-white border-accent-400 text-gray-700';
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-amber-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      stars.push(
        <FiStar
          key={i}
          className={`w-4 h-4 ${
            i < progress?.stars ? 'text-accent-400 fill-accent-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className={`flex items-center ${isLeft ? 'justify-start' : 'justify-end'} relative`}>
      {/* Connection line */}
      {index > 0 && (
        <div 
          className={`absolute top-1/2 ${isLeft ? 'right-1/2' : 'left-1/2'} w-full h-0.5 bg-gray-200 -z-10`}
          style={{ transform: 'translateY(-50%)' }}
        />
      )}

      <motion.button
        onClick={() => isUnlocked && onClick(topic)}
        disabled={!isUnlocked}
        className={`
          roadmap-node relative p-4 rounded-2xl border-2 w-64 text-left
          ${getStatusStyles()}
          ${isUnlocked ? 'cursor-pointer card-hover' : 'cursor-not-allowed'}
          ${isActive ? 'active ring-4 ring-primary-200' : ''}
        `}
        whileHover={isUnlocked ? { scale: 1.02 } : {}}
        whileTap={isUnlocked ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        {/* Lock overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 rounded-2xl bg-gray-50/80 flex items-center justify-center">
            <FiLock className="w-6 h-6 text-gray-400" />
          </div>
        )}

        {/* Completed check */}
        {isCompleted && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
            <FiCheck className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium uppercase ${getDifficultyColor()}`}>
              {difficulty}
            </span>
            <div className="flex gap-0.5">
              {renderStars()}
            </div>
          </div>
          
          <h4 className="font-heading font-bold text-base mb-2">{name}</h4>
          
          {/* Progress bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress?.percentage || 0}%` }}
              transition={{ delay: index * 0.1 + 0.3 }}
            />
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            {progress?.completed || 0}/{progress?.total || 0} lessons
          </p>
        </div>
      </motion.button>
    </div>
  );
};

export default RoadmapNode;
