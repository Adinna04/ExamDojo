// XP calculation based on quiz performance
const calculateQuizXP = (score, totalQuestions, timeBonus = 0) => {
  const percentage = (score / totalQuestions) * 100;
  let baseXP = 0;

  if (percentage >= 90) {
    baseXP = 50;
  } else if (percentage >= 70) {
    baseXP = 30;
  } else if (percentage >= 50) {
    baseXP = 15;
  } else {
    baseXP = 5;
  }

  // Add time bonus (max 20% extra)
  const finalXP = Math.floor(baseXP * (1 + timeBonus));
  
  return {
    baseXP,
    timeBonus: Math.floor(baseXP * timeBonus),
    totalXP: finalXP,
    percentage
  };
};

// Calculate stars based on score
const calculateStars = (percentage) => {
  if (percentage >= 90) return 3;
  if (percentage >= 70) return 2;
  if (percentage >= 50) return 1;
  return 0;
};

// Calculate level from XP
const calculateLevel = (xp) => {
  const xpPerLevel = 500;
  const levelNames = ['Beginner', 'Scholar', 'Expert', 'Champion', 'Master', 'Grandmaster'];
  
  const level = Math.floor(xp / xpPerLevel) + 1;
  const levelIndex = Math.min(Math.floor((level - 1) / 5), levelNames.length - 1);
  const levelName = levelNames[levelIndex];
  
  return { level, levelName };
};

// Check if leveled up
const checkLevelUp = (oldXP, newXP) => {
  const xpPerLevel = 500;
  const oldLevel = Math.floor(oldXP / xpPerLevel) + 1;
  const newLevel = Math.floor(newXP / xpPerLevel) + 1;
  
  return newLevel > oldLevel;
};

module.exports = {
  calculateQuizXP,
  calculateStars,
  calculateLevel,
  checkLevelUp
};
