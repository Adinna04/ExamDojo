/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios'; 
import quizData from '../data/quizData';
import { FiChevronLeft, FiZap, FiRotateCcw, FiHome } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../styles/Quiz.css';

const Quiz = () => {
  const { stream, subject, topic } = useParams();
  const navigate = useNavigate();
  const questions = quizData[stream]?.[subject]?.[topic] || [];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. Timer Logic
  useEffect(() => {
    if (timeLeft > 0 && !showResult && lives > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer(-1); 
    }
  }, [timeLeft, showResult, lives]);

  // 2. XP Sync Logic - FIX: Added Number validation to prevent NaN
  useEffect(() => {
    if (showResult && score >= 0) {
      const syncXP = async () => {
        setIsSyncing(true);
        try {
          const token = localStorage.getItem('token');
          // Sanitize score to ensure it's a valid number
          const finalScore = isNaN(score) ? 0 : Number(score);

          await axios.post('http://localhost:5000/api/users/add-xp', {
            xpEarned: finalScore,
            subject: subject,
            topic: topic
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.success(`NINJA SKILLS SYNCED! +${finalScore} XP Added!`, { icon: '🚀' });
        } catch (err) {
          console.error("XP Sync Error:", err.response?.data || err);
          toast.error("Failed to sync XP. Check connection!");
        } finally {
          setIsSyncing(false);
        }
      };
      syncXP();
    }
  }, [showResult]);

  const handleAnswer = (selectedIdx) => {
    const isCorrect = selectedIdx === questions[currentIdx].correct;
    
    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      // Logic: 10 base XP + 5 bonus XP if combo is 3 or more
      setScore(prev => {
        const points = 10 + (newCombo >= 3 ? 5 : 0);
        return prev + points;
      });
      toast.success(newCombo >= 3 ? `COMBO x${newCombo}! 🔥` : "Correct!", { duration: 1000 });
    } else {
      setCombo(0);
      setLives(prev => prev - 1);
      toast.error("Health Lost! 💔", { duration: 1000 });
      if (lives - 1 <= 0) {
        setShowResult(true);
        return;
      }
    }

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(30);
    } else {
      setShowResult(true);
    }
  };

  if (questions.length === 0) return <div className="loading-center font-black py-20 text-center">BATTLE DATA NOT FOUND! 🛡️</div>;

  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="quiz-page">
      {!showResult ? (
        <>
          <div className="quiz-topbar">
            <button className="quiz-back" onClick={() => navigate(-1)}>
              <FiChevronLeft /> QUIT
            </button>
            <div className="quiz-title">{subject} - {topic}</div>
            
            <div className={`quiz-timer-ring ${timeLeft < 10 ? 'danger' : timeLeft < 20 ? 'warning' : ''}`}>
              <svg className="timer-svg">
                <circle className="timer-track" cx="28" cy="28" r="24" />
                <circle 
                  className="timer-progress" 
                  cx="28" cy="28" r="24" 
                  style={{ 
                    strokeDasharray: 150.8, 
                    strokeDashoffset: 150.8 - (150.8 * timeLeft) / 30 
                  }}
                />
              </svg>
              <div className="timer-center">{timeLeft}<span>sec</span></div>
            </div>
          </div>

          <div className="quiz-progress">
            <div className="progress-info">
              <span>Mission Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <AnimatePresence>
            {combo >= 2 && (
              <motion.div 
                initial={{ scale: 0, y: 20 }} 
                animate={{ scale: 1.2, y: 0 }} 
                exit={{ scale: 0 }} 
                className="combo-pop"
              >
                {combo}x COMBO 🔥
              </motion.div>
            )}
          </AnimatePresence>

          <div className="question-card">
            <div className="question-meta">
              <span className="question-tag">BATTLE {currentIdx + 1}</span>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className={`text-2xl transition-all duration-300 ${i < lives ? 'opacity-100 scale-110' : 'opacity-20 scale-90'}`}>❤️</span>
                ))}
              </div>
            </div>
            <h3 className="question-text">{questions[currentIdx].question}</h3>

            <div className="options-grid">
              {questions[currentIdx].options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleAnswer(i)} 
                  className="option-btn"
                >
                  <span className="option-label">{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="result-screen">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="result-card"
          >
            <span className="result-emoji">{lives > 0 ? '🏆' : '💀'}</span>
            <h2 className="result-title">{lives > 0 ? 'Mission Accomplished!' : 'Mission Failed'}</h2>
            <p className="result-sub">Battle Performance in {topic}</p>
            
            <div className="result-stats">
              <div className="result-stat">
                <div className="result-stat-num">{Math.floor(score / 10)}</div>
                <div className="result-stat-label">Correct</div>
              </div>
              <div className="result-stat">
                <div className="result-stat-num">{questions.length}</div>
                <div className="result-stat-label">Total</div>
              </div>
              <div className="result-stat">
                <div className="result-stat-num">
                  {questions.length > 0 ? ((score / (questions.length * 10)) * 100).toFixed(0) : 0}%
                </div>
                <div className="result-stat-label">Accuracy</div>
              </div>
            </div>

            <div className="xp-earned">
              {isSyncing ? "Syncing with Dojo..." : `✨ TOTAL XP EARNED: ${score} XP`}
            </div>

            <div className="result-btns">
              <button className="quiz-back" onClick={() => window.location.reload()}>
                <FiRotateCcw /> RETRY
              </button>
              <button className="quiz-next-btn" onClick={() => navigate('/dashboard')}>
                <FiHome /> DASHBOARD
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Quiz;