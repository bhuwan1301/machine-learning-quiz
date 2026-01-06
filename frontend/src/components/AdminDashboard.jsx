import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { API_URL } from '../config';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const username = localStorage.getItem('username');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    // Check if user is logged in and is admin
    if (!username) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      navigate('/quiz');
      return;
    }

    fetchUsers();
  }, [username, isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError('Invalid data received from server');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (username) => {
    navigate(`/admin/user/${username}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-content">
        {/* Header */}
        <div className="admin-header">
          <div className="header-info">
            <h1>📊 Admin Dashboard</h1>
            <p>Welcome, <strong>{username}</strong> (Administrator)</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>

        {/* Stats Card */}
        <div className="stats-card">
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <div className="stat-details">
              <div className="stat-value">{users.length}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-section">
          <h2>All Users</h2>
          
          {error && <div className="error-message">{error}</div>}

          {users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No users have submitted quizzes yet</p>
            </div>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.charAt(0).toUpperCase()}
                          </div>
                          <span>{user}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleUserClick(user)}
                          className="view-btn"
                        >
                          📝 View Submissions
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
