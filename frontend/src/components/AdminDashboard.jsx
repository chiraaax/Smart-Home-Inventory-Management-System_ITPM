import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ total: 0, admins: 0, users: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.role !== 'admin') {
            navigate('/home');
            return;
          }
          setUser(parsedUser);
        } else {
          const res = await api.get('/auth/me');
          if (res.data.role !== 'admin') {
            navigate('/home');
            return;
          }
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      if (activeTab === 'dashboard' && user?.role === 'admin') {
        try {
          const res = await api.get('/users');
          const users = res.data;
          const total = users.length;
          const admins = users.filter(u => u.role === 'admin').length;
          const regularUsers = users.filter(u => u.role === 'user').length;
          setStats({ total, admins, users: regularUsers });
        } catch (err) {
          console.error('Error fetching stats:', err);
        }
      }
    };

    fetchStats();
  }, [activeTab, user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'dashboard'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'users'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              User Management
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-purple-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800 mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
              </div>
              
              <div className="bg-blue-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">Admin Accounts</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.admins}</p>
              </div>
              
              <div className="bg-green-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-2">Regular Users</h3>
                <p className="text-3xl font-bold text-green-600">{stats.users}</p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Admin Information</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Username:</span> {user?.username}</p>
                <p><span className="font-semibold">Role:</span> {user?.role}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && <UserManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;

