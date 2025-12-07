import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import UserHomepage from './components/UserHomepage';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const isAuthenticated = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <Router>
      <Routes>

        {/* If logged in → redirect away from login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              user?.role === 'admin' 
                ? <Navigate to="/admin/dashboard" replace />
                : <Navigate to="/home" replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Block admins from seeing signup */}
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Signup />
          }
        />

        {/* User Homepage */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <UserHomepage />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all: redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
