/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSettings, FiUsers, FiPlus, FiTrash2, 
  FiDatabase, FiBarChart2, FiCheckCircle, FiAlertCircle 
} from 'react-icons/fi';
import api from '../api/auth';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State for new questions
  const [formData, setFormData] = useState({
    questionText: '',
    department: 'CS',
    difficulty: 'medium',
    options: [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    explanation: ''
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, questionsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/questions')
      ]);
      setStats(statsRes.data);
      setQuestions(questionsRes.data.questions);
    } catch (err) {
      toast.error("Failed to load scrolls of wisdom (Admin Data)");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/questions', formData);
      toast.success("New challenge added to the Dojo!");
      fetchAdminData();
      setActiveTab('questions');
    } catch (err) {
      toast.error("Failed to forge new question");
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse">PREPARING COMMAND CENTER...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <FiSettings className="text-primary-500 animate-spin-slow" /> Admin Dojo
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage the path of knowledge for all students.</p>
        </div>
        <div className="flex gap-2">
          {['overview', 'questions', 'add'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all capitalize
                ${activeTab === tab 
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-100' 
                  : 'bg-white text-slate-500 border-2 border-slate-100 hover:bg-slate-50'}
              `}
            >
              {tab === 'add' ? '+ Add Question' : tab}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { label: 'Total Warriors', val: stats?.stats?.users, icon: <FiUsers />, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Active Streams', val: stats?.stats?.streams, icon: <FiDatabase />, color: 'text-purple-500', bg: 'bg-purple-50' },
              { label: 'Total Challenges', val: stats?.stats?.questions, icon: <FiCheckCircle />, color: 'text-green-500', bg: 'bg-green-50' },
              { label: 'Avg Accuracy', val: '72%', icon: <FiBarChart2 />, color: 'text-orange-500', bg: 'bg-orange-50' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border-2 border-b-8 border-slate-100 shadow-sm">
                <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center text-xl mb-4`}>
                  {s.icon}
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{s.val}</p>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'questions' && (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-[2.5rem] border-2 border-b-8 border-slate-100 overflow-hidden shadow-sm"
          >
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b-2 border-slate-100">
                <tr>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Question</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Dept</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Difficulty</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {questions.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 font-bold text-slate-700 max-w-md truncate">{q.questionText}</td>
                    <td className="p-6 text-sm font-black text-primary-600">{q.stream?.code || 'CS'}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                        ${q.difficulty === 'hard' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}
                      `}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {activeTab === 'add' && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[2.5rem] border-2 border-b-8 border-slate-100 shadow-xl max-w-3xl mx-auto"
          >
            <form onSubmit={handleAddQuestion} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Question Prompt</label>
                <textarea 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500 focus:bg-white outline-none font-bold transition-all"
                  rows="3"
                  placeholder="Enter the challenge text..."
                  value={formData.questionText}
                  onChange={(e) => setFormData({...formData, questionText: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Department</label>
                  <select 
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  >
                    <option value="CS">Computer Science</option>
                    <option value="ECE">Electronics</option>
                    <option value="ME">Mechanical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Difficulty</label>
                  <select 
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  >
                    <option value="easy">Easy (Beginner)</option>
                    <option value="medium">Medium (Scholar)</option>
                    <option value="hard">Hard (Master)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest block">Options (Select the correct one)</label>
                {formData.options.map((opt, i) => (
                  <div key={i} className="flex gap-3">
                    <input 
                      type="radio" 
                      name="correctIdx" 
                      checked={opt.isCorrect}
                      onChange={() => {
                        const newOpts = formData.options.map((o, idx) => ({ ...o, isCorrect: idx === i }));
                        setFormData({...formData, options: newOpts});
                      }}
                      className="w-6 h-6 mt-3 accent-primary-500"
                    />
                    <input 
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      className="flex-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none"
                      value={opt.text}
                      onChange={(e) => {
                        const newOpts = [...formData.options];
                        newOpts[i].text = e.target.value;
                        setFormData({...formData, options: newOpts});
                      }}
                    />
                  </div>
                ))}
              </div>

              <button type="submit" className="w-full btn-primary py-5">
                Forging New Wisdom (Save Question)
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;