/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';

const ComboAnimation = ({ combo, show }) => {
  if (!show || combo < 2) return null;

  const getComboColor = () => {
    if (combo >= 10) return 'text-purple-500';
    if (combo >= 7) return 'text-orange-500';
    if (combo >= 5) return 'text-amber-500';
    if (combo >= 3) return 'text-primary-500';
    return 'text-blue-500';
  };

  const getComboEmoji = () => {
    if (combo >= 10) return '🔥🔥🔥';
    if (combo >= 7) return '🔥🔥';
    if (combo >= 5) return '🔥';
    if (combo >= 3) return '⚡';
    return '✨';
  };

  return (
    <AnimatePresence>
      <motion.div
        key={combo}
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3 }}
          className={`text-4xl font-heading font-black ${getComboColor()} drop-shadow-lg combo-text`}
        >
          {combo}x COMBO! {getComboEmoji()}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComboAnimation;