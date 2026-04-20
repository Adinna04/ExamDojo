/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TimerRing = ({ duration, onTimeout, isPaused = false, size = 60 }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / duration) * circumference;

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, onTimeout, timeLeft]);

  const getColor = () => {
    const percentage = (timeLeft / duration) * 100;
    if (percentage > 50) return '#16a34a';
    if (percentage > 25) return '#eab308';
    return '#dc2626';
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="font-bold text-sm"
          style={{ color: getColor() }}
        >
          {timeLeft}
        </span>
      </div>
    </div>
  );
};

export default TimerRing;
