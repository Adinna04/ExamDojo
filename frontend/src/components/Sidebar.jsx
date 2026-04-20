/* eslint-disable no-unused-vars */
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiLayers, 
  FiAward, 
  FiBarChart2, 
  FiUser, 
  FiFileText, 
  FiSettings, 
  FiLogOut 
} from 'react-icons/fi';
import XPBar from './XPBar';
import StreakCounter from './StreakCounter';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Base navigation for everyone
  const navItems = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/streams', icon: FiLayers, label: 'Learn' },
    { to: '/leaderboard', icon: FiBarChart2, label: 'Leaderboard' },
    { to: '/achievements', icon: FiAward, label: 'Achievements' },
    { to: '/notes', icon: FiFileText, label: 'Notes' },
    { to: '/profile', icon: FiUser, label: 'Profile' },
  ];

  // Dynamically add Admin Panel if user is an admin
  if (user?.isAdmin) {
    navItems.push({ to: '/admin', icon: FiSettings, label: 'Admin Panel' });
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r-2 border-slate-100 flex flex-col z-50">
      {/* Logo Section */}
      <div className="p-6 mb-2">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-100 group-hover:scale-110 transition-transform duration-300">
            <span className="text-white text-2xl">🎯</span>
          </div>
          <span className="font-heading font-black text-2xl text-slate-800 tracking-tight">
            Exam<span className="text-primary-500">Dojo</span>
          </span>
        </div>
      </div>

      {/* Stats & Progress Card */}
      <div className="px-6 py-4">
        <div className="bg-slate-50 p-4 rounded-[2rem] border border-slate-100 shadow-inner">
          <div className="flex items-center justify-between mb-3">
             <StreakCounter streak={user?.streak?.current || 0} size="small" />
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
               Lv. {user?.level || 1}
             </span>
          </div>
          <XPBar 
            current={user?.xpProgress?.current || 0} 
            required={user?.xpProgress?.required || 500}
            showLabel={false}
          />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-100'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`text-xl ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-500'}`} />
                    <span className="tracking-wide">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile Info Footer */}
      <div className="p-4 border-t border-slate-50">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black shadow-inner">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-slate-800 truncate leading-none mb-1">
              {user?.username}
            </p>
            <p className="text-[10px] font-bold text-primary-600 uppercase tracking-tighter italic">
              {user?.isAdmin ? 'Dojo Master' : (user?.levelName || 'Beginner')}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Logout"
          >
            <FiLogOut className="text-lg" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;