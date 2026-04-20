/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiStar, FiCheckCircle, FiX, FiZap, FiTarget } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import '../styles/Streams.css';

const Streams = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSub, setSelectedSub] = useState(null);

  const subjects = [
    { id: 'dbms', name: 'DBMS', icon: '🗄️', status: 'completed', xp: 500, topics: 8 },
    { id: 'os', name: 'Operating Systems', icon: '💻', status: 'active', xp: 800, topics: 12 },
    { id: 'cn', name: 'Computer Networks', icon: '🌐', status: 'locked', xp: 600, topics: 10 },
    { id: 'toc', name: 'TOC', icon: '⚙️', status: 'locked', xp: 900, topics: 15 },
    { id: 'cd', name: 'Compiler Design', icon: '🏗️', status: 'locked', xp: 750, topics: 9 },
  ];

  return (
    <div className="map-page-wrapper pb-20">
      <header className="map-header pt-10 pb-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-slate-900 tracking-tighter"
        >
          THE NINJA <span className="text-primary-500">PATH</span>
        </motion.h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-3">
          Level up your skills, Subject by Subject
        </p>
      </header>

      <div className="skill-tree-container">
        {subjects.map((sub, index) => (
          <div key={sub.id} className="node-wrapper">
            {index !== subjects.length - 1 && (
              <div className={`connector-line ${sub.status === 'completed' ? 'active' : ''}`}></div>
            )}

            <motion.div 
              whileHover={sub.status !== 'locked' ? { scale: 1.15, rotate: 5 } : {}}
              whileTap={sub.status !== 'locked' ? { scale: 0.95 } : {}}
              onClick={() => sub.status !== 'locked' && setSelectedSub(sub)}
              className={`map-node ${sub.status}`}
            >
              <div className="node-inner">
                {sub.status === 'locked' ? <FiLock /> : <span className="text-4xl">{sub.icon}</span>}
              </div>
              
              <div className="node-label-box">
                <h3 className="text-lg font-black text-slate-800">{sub.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-wider text-primary-500">
                  {sub.status === 'active' ? 'Current Mission' : sub.status}
                </p>
              </div>

              {sub.status === 'completed' && <div className="node-star">⭐</div>}
            </motion.div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-white p-10 rounded-[3.5rem] max-w-sm w-full text-center border-b-[16px] border-primary-500 shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedSub(null)}
                className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-red-500"
              >
                <FiX size={20} />
              </button>

              <div className="text-7xl mb-6 drop-shadow-xl">{selectedSub.icon}</div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedSub.name}</h2>
              
              <div className="grid gap-3 mb-10 mt-6">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                  <span className="flex items-center gap-2 font-bold text-slate-400 text-sm"><FiZap /> REWARD</span>
                  <span className="font-black text-slate-800">+{selectedSub.xp} XP</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedSub(null);
                  /* FIX: Exact URL match for App.js */
                  navigate(`/subjects/${selectedSub.id}`); 
                }}
                className="w-full py-5 bg-primary-500 text-white rounded-[2rem] font-black text-lg shadow-xl"
              >
                ACCEPT MISSION
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Streams;