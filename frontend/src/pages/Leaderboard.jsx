import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardData, getLeaderboard } from '../api/auth';
import { FiAward, FiChevronLeft, FiTrendingUp, FiZap } from 'react-icons/fi';
import '../styles/Leaderboard.css';

function Leaderboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('weekly');
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [lbLoading, setLbLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const data = await getDashboardData();
        data?._id ? setUser(data) : navigate('/login');
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchLb = async () => {
      setLbLoading(true);
      try {
        const data = await getLeaderboard(filter);
        setLeaderboard(Array.isArray(data) ? data : []);
      } catch (err) {
        setLeaderboard([]);
      } finally {
        setLbLoading(false);
      }
    };
    fetchLb();
    const interval = setInterval(fetchLb, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const podiumOrder = leaderboard.length >= 3
    ? [leaderboard[1], leaderboard[0], leaderboard[2]]
    : [];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 font-black text-primary-600 animate-pulse">
      SYNCING DOJO RANKINGS...
    </div>
  );

  return (
    <div className="leaderboard-page">
      <main className="leaderboard-container max-w-4xl mx-auto px-4 py-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="back-link">
            <FiChevronLeft /> Dashboard
          </Link>
          <div className="lb-filter-pills">
            {['weekly', 'monthly', 'alltime'].map(f => (
              <button 
                key={f} 
                className={filter === f ? 'active' : ''} 
                onClick={() => setFilter(f)}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Your Rank Hero Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="user-rank-hero"
        >
          <div className="flex items-center gap-6">
            <div className="hero-avatar">
               {user?.profilePicture ? (
                 <img src={`http://localhost:5000${user.profilePicture}`} alt="me" />
               ) : user?.username?.charAt(0)}
            </div>
            <div>
              <h2 className="text-white text-2xl font-black">{user?.username}</h2>
              <p className="text-primary-100 font-bold opacity-80 uppercase tracking-widest text-xs">Your Current Standing</p>
            </div>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="block text-3xl font-black text-white">{user?.xp || 0}</span>
              <span className="text-[10px] font-black text-primary-200 uppercase">XP</span>
            </div>
            <div className="hero-stat pl-6 border-l border-white/20">
              <span className="block text-3xl font-black text-yellow-300">#{leaderboard.findIndex(p => p._id === user?._id) + 1 || '-'}</span>
              <span className="text-[10px] font-black text-primary-200 uppercase">Rank</span>
            </div>
          </div>
        </motion.div>

        {/* Podium Section */}
        {!lbLoading && podiumOrder.length >= 3 && (
          <div className="podium-section">
            {podiumOrder.map((player, index) => (
              <div key={player._id} className={`podium-card podium-rank-${index}`}>
                <div className="podium-avatar-wrap">
                  <div className="podium-avatar-main shadow-xl">
                    {player.profilePicture ? (
                       <img src={`http://localhost:5000${player.profilePicture}`} alt="p" className="w-full h-full object-cover" />
                    ) : (
                       <span className="font-black text-slate-700">{player.username?.charAt(0)}</span>
                    )}
                  </div>
                  {index === 1 && <div className="crown-icon">👑</div>}
                  <div className={`rank-tag rank-tag-${index}`}>
                    {index === 0 ? '2' : index === 1 ? '1' : '3'}
                  </div>
                </div>
                <div className="podium-info">
                  <p className="name">{player.username}</p>
                  <p className="xp">{player.xp} <span className="text-[8px] opacity-60">XP</span></p>
                </div>
                <div className={`podium-stand stand-${index}`}></div>
              </div>
            ))}
          </div>
        )}

        {/* List Section */}
        <div className="leaderboard-list">
          <AnimatePresence>
            {leaderboard.map((player, index) => {
              const isMe = user?._id === player._id;
              const rank = index + 1;
              return (
                <motion.div 
                  key={player._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`list-item ${isMe ? 'is-me' : ''}`}
                >
                  <div className="list-rank">
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                  </div>
                  <div className="list-avatar">
                    {player.profilePicture ? (
                      <img src={`http://localhost:5000${player.profilePicture}`} alt="p" />
                    ) : player.username?.charAt(0)}
                  </div>
                  <div className="list-name">
                    <p className="font-black text-slate-800">{player.username}</p>
                    {isMe && <span className="text-[10px] font-black text-primary-500 uppercase">You</span>}
                  </div>
                  <div className="list-right">
                     <span className="streak-badge">🔥 {player.streak?.current || 0}</span>
                     <span className="xp-badge">{player.xp} <span>XP</span></span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default Leaderboard;