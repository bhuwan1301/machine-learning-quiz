import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Quiz from './components/Quiz';
import Results from './components/Results';
import AdminDashboard from './components/AdminDashboard';
import UserSubmissions from './components/UserSubmissions';
import './App.css';

// Protected Route Component for authenticated users
function ProtectedRoute({ children }) {
  const username = localStorage.getItem('username');
  
  if (!username) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Protected Route Component for admin users only
function AdminRoute({ children }) {
  const username = localStorage.getItem('username');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  if (!username) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/quiz" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Route - Login (default) */}
          <Route path="/login" element={<Login />} />
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Protected Route - Quiz (for authenticated users) */}
          <Route 
            path="/quiz" 
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Route - Results (for authenticated users) */}
          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Only Route - Dashboard */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          
          {/* Admin Only Route - User Submissions */}
          <Route 
            path="/admin/user/:username" 
            element={
              <AdminRoute>
                <UserSubmissions />
              </AdminRoute>
            } 
          />
          
          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
