import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Streams from './pages/Streams';
import Subjects from './pages/Subjects';
import Roadmap from './pages/Roadmap';
import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Notes from './pages/Notes';
import Achievements from './pages/Achievements';
import AdminPanel from './pages/AdminPanel';

// Components
import Sidebar from './components/Sidebar';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Layout with Sidebar
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      {/* Standard Student Protected Routes */}
      {[
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/streams", element: <Streams /> },
        { path: "/streams/:streamId/subjects", element: <Subjects /> },
        
        /* SUCCESS FIX: Navigation ab is path ko correctly catch karega */
        { path: "/subjects/:subjectId", element: <Roadmap /> }, 
        
        { path: "/leaderboard", element: <Leaderboard /> },
        { path: "/profile", element: <Profile /> },
        { path: "/notes", element: <Notes /> },
        { path: "/achievements", element: <Achievements /> },
      ].map((route) => (
        <Route 
          key={route.path}
          path={route.path} 
          element={
            <ProtectedRoute>
              <DashboardLayout>{route.element}</DashboardLayout>
            </ProtectedRoute>
          } 
        />
      ))}

      {/* Special Full-Screen Route */}
      <Route path="/quiz/:stream/:subject/:topic" element={
        <ProtectedRoute>
          <Quiz />
        </ProtectedRoute>
      } />

      {/* Admin Protected Route */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly={true}>
          <DashboardLayout>
            <AdminPanel />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;