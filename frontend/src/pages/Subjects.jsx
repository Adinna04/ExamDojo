/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { roadmapAPI } from '../api/roadmap';
import { FiChevronLeft, FiLayers } from 'react-icons/fi';

const Subjects = () => {
  const { streamId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await roadmapAPI.getSubjects(streamId);
        setSubjects(response.data.subjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [streamId]);

  if (loading) return <div className="p-8 text-center">Loading Subjects...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate('/streams')} className="p-3 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50">
          <FiChevronLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900">Stream Subjects</h1>
          <p className="text-gray-500">Master each subject to complete your track.</p>
        </div>
      </header>

      <div className="grid gap-4">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row md:items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: `${subject.color}15`, color: subject.color }}>
              {subject.icon}
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-black text-gray-800">{subject.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{subject.description}</p>
            </div>

            <div className="flex flex-col items-end gap-2 min-w-[150px]">
              <div className="flex items-center gap-2 text-xs font-black text-gray-400">
                <FiLayers /> {subject.progress.completed}/{subject.progress.total} TOPICS
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${subject.progress.percentage}%` }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: subject.color }}
                />
              </div>
              <span className="text-xs font-bold" style={{ color: subject.color }}>{subject.progress.percentage}% Mastered</span>
            </div>

            <button 
              onClick={() => navigate(`/subjects/${subject._id}/roadmap`)}
              className="px-6 py-3 rounded-2xl font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              Explore
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Subjects;