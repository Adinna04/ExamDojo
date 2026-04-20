/* eslint-disable no-unused-vars */
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; 
import { 
  FiUser, FiMail, FiTarget, FiEdit2, 
  FiAward, FiPieChart, FiCamera, FiShield 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser } = useAuth(); // AuthContext se setUser liya
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  // --- Assignment 7: Multer Upload Function ---
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation: Max 2MB
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("File size too large! Max 2MB.");
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('token'); 
      
      const res = await axios.post('http://localhost:5000/api/users/profile-picture', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.data.success) {
        // Backend se naya path milte hi global user state update karein
        setUser({ ...user, profilePicture: res.data.filePath });
        toast.success('Dojo Avatar updated! 🥷');
      }
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error('Failed to upload image. Check server.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4">
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Your Dojo Profile</h1>
        <p className="text-gray-500 text-lg font-medium">Manage your identity and track your legendary progress.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Card: Profile Display */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-b-8 border-slate-100 shadow-sm text-center">
            <div className="relative inline-block">
              {/* Profile Picture Container */}
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-5xl font-black shadow-xl mb-4 overflow-hidden border-4 border-white">
                {user?.profilePicture ? (
                  <img 
                    src={`http://localhost:5000${user.profilePicture}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover" // <-- YEAH HAI FIX! object-cover se photo stretch nahi hogi
                  />
                ) : (
                  <span className="select-none">{user?.username?.charAt(0).toUpperCase()}</span>
                )}
                
                {/* Uploading Overlay */}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                onChange={handlePhotoUpload}
                accept="image/*"
              />

              {/* Camera Action Button */}
              <button 
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-2 right-2 p-2.5 bg-white rounded-xl border-2 border-slate-100 text-slate-600 shadow-lg hover:text-primary-500 hover:scale-110 transition-all active:scale-95"
                title="Change Profile Picture"
              >
                <FiCamera size={18} />
              </button>
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mt-2">{user?.username}</h2>
            <p className="text-primary-600 font-bold uppercase tracking-widest text-[10px] mt-1 italic px-3 py-1 bg-primary-50 inline-block rounded-full">
              {user?.levelName || 'Ninja Beginner'}
            </p>

            {/* Info Badges */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400"><FiMail size={16}/></div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Email Address</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400"><FiShield size={16}/></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Role</p>
                  <p className="text-sm font-bold text-slate-700">{user?.role || 'Student'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Statistics Grid */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-b-8 border-slate-100 shadow-sm">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-800">
              <div className="p-2 bg-primary-500 rounded-xl text-white shadow-lg shadow-primary-200"><FiPieChart /></div>
              Battle Statistics
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div className="group">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-primary-500 transition-colors">Total XP</p>
                <p className="text-4xl font-black text-slate-900">{user?.xp || 0}</p>
              </div>
              <div className="group">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-orange-500 transition-colors">Current Streak</p>
                <p className="text-4xl font-black text-orange-500 flex items-center gap-2">
                  <span className="text-2xl">🔥</span> {user?.streak?.current || 0}
                </p>
              </div>
              <div className="group">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">Achievements</p>
                <p className="text-4xl font-black text-slate-900">{user?.achievements?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* Assignment 7 Highlight Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group"
          >
            {/* Background Decoration */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
            
            <div className="relative flex items-center gap-8">
              <div className="text-7xl drop-shadow-lg">📸</div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Assignment 7: Complete!</h3>
                <p className="text-indigo-100 font-medium max-w-md leading-relaxed opacity-90">
                  Multer integration is working. Your image is being served as a static asset from <code className="bg-black/20 px-1 rounded text-white">/uploads</code>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;