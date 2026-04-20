/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronLeft } from 'react-icons/fi';
import '../styles/Roadmap.css';

const Roadmap = () => {
  const { subjectId } = useParams(); // 'dbms' or 'os'
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ye topics exactly quizData.js ki keys se match hone chahiye
    const fetchRoadmapData = () => {
      const dataMapping = {
        dbms: [
          { _id: 't1', title: 'ER Diagrams', isUnlocked: true, isCompleted: true },
          { _id: 't2', title: 'Relational Model', isUnlocked: true, isCompleted: false },
          { _id: 't3', title: 'SQL Joins', isUnlocked: false, isCompleted: false },
        ],
        os: [
          { _id: 't1', title: 'Introduction', isUnlocked: true, isCompleted: false },
        ]
      };

      setTopics(dataMapping[subjectId] || []);
      setLoading(false);
    };
    fetchRoadmapData();
  }, [subjectId]);

  const handleNodeClick = (topic) => {
    if (topic.isUnlocked) {
      // Logic: /quiz/STREAM/SUBJECT/TOPIC_NAME
      // subjectId (e.g. 'dbms') aur topic.title (e.g. 'ER Diagrams') match hone chahiye quizData.js se
      navigate(`/quiz/CS/${subjectId}/${topic.title}`);
    }
  };

  if (loading) return <div className="loading-center min-h-screen font-black">SCANNING PATH...</div>;

  return (
    <div className="roadmap-page">
      <header className="roadmap-header">
        <button onClick={() => navigate('/streams')} className="back-btn">
          <FiChevronLeft size={20} /> BACK
        </button>
        <div className="w-full">
          <p className="tiny-label uppercase tracking-widest">Mastery Journey</p>
          <h1 className="text-4xl font-black">{subjectId?.toUpperCase()}</h1>
        </div>
      </header>

      <div className="roadmap-track">
        {topics.map((topic, index) => {
          const isLeft = index % 2 === 0;
          const statusClass = topic.isCompleted ? 'done' : topic.isUnlocked ? 'open' : 'locked';

          return (
            <motion.div 
              key={topic._id}
              initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`roadmap-row ${isLeft ? 'left' : 'right'}`}
            >
              <button 
                className={`path-node ${statusClass}`}
                onClick={() => handleNodeClick(topic)}
                disabled={!topic.isUnlocked}
              >
                <span className="node-emoji">
                  {topic.isCompleted ? '⭐' : topic.isUnlocked ? '🎯' : '🔒'}
                </span>
              </button>

              <div className="node-info">
                <p className="tiny-label" style={{ color: 'var(--muted)', fontSize: '11px' }}>TOPIC {index + 1}</p>
                <h3>{topic.title}</h3>
                <p>{topic.isUnlocked ? 'Ready to Battle!' : 'Locked Area'}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;