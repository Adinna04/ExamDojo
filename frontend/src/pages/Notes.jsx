/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFileText, FiDownloadCloud, FiSearch, 
  FiBook, FiX, FiCheckCircle, FiInfo 
} from 'react-icons/fi';
import notesData from '../data/notesData'; 
import { useAuth } from '../context/AuthContext';
import '../styles/Notes.css'; // Ensure your CSS is imported

const Notes = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(user?.department || 'CS');
  const [selectedNote, setSelectedNote] = useState(null);

  const subjects = ['CS', 'ECE', 'ME', 'CE', 'EE'];
  
  // Filtering logic
  const filteredNotes = notesData[activeTab]?.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="notes-page">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Study Vault</h1>
            <p className="text-gray-500 mt-2 text-lg font-medium">
              Premium notes curated for your <span className="text-primary-600">GATE & Semester</span> preparation.
            </p>
          </div>
          
          <div className="relative group w-full md:w-80">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search topics..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white rounded-2xl border-2 border-slate-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none w-full font-bold transition-all shadow-sm"
            />
          </div>
        </header>

        {/* Stream Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => setActiveTab(subject)}
              className={`px-8 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap
                ${activeTab === subject 
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-200 scale-105' 
                  : 'bg-white text-slate-500 border-2 border-slate-100 hover:bg-slate-50'}
              `}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Notes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="note-card"
              >
                <div className="flex items-start justify-between">
                  <div className="note-icon-box">
                    {note.icon}
                  </div>
                  <span className="subject-tag">
                    {note.subject}
                  </span>
                </div>
                
                <h3>{note.title}</h3>
                
                <div className="flex gap-4 mb-8">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <FiBook size={14} className="text-primary-500" /> {note.topics} Topics
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <FiFileText size={14} className="text-blue-500" /> {note.readTime}
                  </div>
                </div>

                <div className="mt-auto pt-4 flex gap-3">
                  <button 
                    onClick={() => setSelectedNote(note)}
                    className="view-btn"
                  >
                    View Content
                  </button>
                  <button className="download-btn" title="Download PDF">
                    <FiDownloadCloud size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="text-6xl">🔍</div>
              <h3 className="text-2xl font-black text-slate-800">No notes found for "{searchTerm}"</h3>
              <p className="text-slate-500 font-medium">Try searching for another topic in {activeTab}.</p>
            </div>
          )}
        </div>

        {/* --- NOTES CONTENT MODAL --- */}
        <AnimatePresence>
          {selectedNote && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-3xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border-4 border-white"
              >
                {/* Modal Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                      {selectedNote.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">{selectedNote.title}</h2>
                      <p className="text-sm font-bold text-primary-600 uppercase tracking-widest">
                        {selectedNote.subject} • Master Guide
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedNote(null)} 
                    className="p-3 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                {/* Modal Scrollable Content */}
                <div className="p-8 overflow-y-auto space-y-8 modal-scroll bg-white">
                  {selectedNote.content.map((item, idx) => (
                    <div key={idx} className="space-y-4">
                      <h4 className="text-xl font-black text-slate-800 flex items-center gap-3">
                        <span className="w-2 h-8 bg-primary-500 rounded-full"></span>
                        {item.heading}
                      </h4>
                      
                      {item.type === 'text' && (
                        <p className="text-slate-600 leading-relaxed text-lg font-medium pl-5">
                          {item.text}
                        </p>
                      )}
                      
                      {item.type === 'points' && (
                        <ul className="grid gap-3 pl-5">
                          {item.points.map((p, i) => (
                            <li key={i} className="flex gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 font-bold hover:border-primary-200 transition-colors">
                              <FiCheckCircle className="text-primary-500 mt-1 shrink-0" size={20} /> 
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.type === 'formula' && (
                        <div className="formula-block">
                          {item.text}
                        </div>
                      )}

                      {item.type === 'tip' && (
                        <div className="tip-box">
                           <FiInfo className="shrink-0" size={24} />
                           <p className="font-bold">{item.text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Modal Footer */}
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
                  <button 
                    onClick={() => window.print()} 
                    className="px-10 py-4 bg-primary-500 text-white rounded-2xl font-black shadow-xl shadow-primary-200 hover:scale-105 transition-all flex items-center gap-3"
                  >
                    <FiDownloadCloud size={20} /> Print for Offline Study
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notes;