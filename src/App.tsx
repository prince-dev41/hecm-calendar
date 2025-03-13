import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Professors } from './components/Professors';
import { Students } from './components/Students';
import { Statistics } from './components/Statistics';
import { Settings } from './components/Settings';
import { Loader } from 'lucide-react';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-800">
        <Loader className="animate-spin rounded-full h-8 w-8 border-b-2 text-white" />
        <div></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/professors" 
          element={user ? <Professors /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/students" 
          element={user ? <Students /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/statistics" 
          element={user ? <Statistics /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/settings" 
          element={user ? <Settings /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;