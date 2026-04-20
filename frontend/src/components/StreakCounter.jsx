/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi'; // Changed from FiFlame to FiZap

const StreakCounter = ({ streak, size = 'default' }) => {
  const isActive = streak > 0;
  
  const sizes = {
    small: {
      container: 'gap-1',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    default: {
      container: 'gap-2',
      icon: 'w-5 h-5',
      text: 'text-base'
    },
    large: {
      container: 'gap-3',
      icon: 'w-8 h-8',
      text: 'text-2xl'
    }
  };

  const s = sizes[size] || sizes.default;

  return (
    <div className={`flex items-center ${s.container}`}>
      <motion.div
        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
      >
        {/* Changed component name from FiFire to FiZap */}
        <FiZap 
          className={`${s.icon} ${isActive ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`}
        />
      </motion.div>
      <span className={`font-black ${s.text} ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>
        {streak}
      </span>
      {size !== 'small' && (
        <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">
          day streak
        </span>
      )}
    </div>
  );
};

export default StreakCounter;