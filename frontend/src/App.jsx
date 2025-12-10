import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import UserHomepage from './components/UserHomepage';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication on mount and when storage changes
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        setIsAuthenticated(!!token);
        setUser(userData ? JSON.parse(userData) : null);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (useful for multi-tab scenarios)
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              user?.role === 'admin' 
                ? <Navigate to="/admin/dashboard" replace />
                : <Navigate to="/home" replace />
            ) : (
              <Login onLogin={() => setIsAuthenticated(true)} />
            )
          }
        />

        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/home'} replace />
            ) : (
              <Signup />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
              <UserHomepage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} user={user} requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route 
          path="/" 
          element={
            <Navigate 
              to={isAuthenticated ? (user?.role === 'admin' ? '/admin/dashboard' : '/home') : '/login'} 
              replace 
            />
          } 
        />

        {/* Catch-all route */}
        <Route 
          path="*" 
          element={
            <Navigate 
              to={isAuthenticated ? (user?.role === 'admin' ? '/admin/dashboard' : '/home') : '/login'} 
              replace 
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;