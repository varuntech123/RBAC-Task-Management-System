import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Trash2, Edit2, Users, User, Shield, ShieldCheck, Mail, CheckCircle2, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import StatsCard from '../components/StatsCard';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/stats');
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', newUser);
      setShowModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'USER' });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert('Error deleting user');
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>User Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>Create, manage and assign roles to system users</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
          <UserPlus size={18} />
          Add New User
        </button>
      </div>

      {stats && (
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <StatsCard title="Total Users" value={stats.totalUsers} icon={Users} color="#6366f1" />
          <StatsCard title="Active Tasks" value={stats.totalTasks} icon={BarChart3} color="#a855f7" />
          <StatsCard title="Completed" value={stats.byStatus?.COMPLETED || 0} icon={CheckCircle2} color="#10b981" />
          <StatsCard title="Pending" value={stats.byStatus?.PENDING || 0} icon={Clock} color="#f59e0b" />
          <StatsCard title="High Priority" value={stats.byPriority?.HIGH || 0} icon={AlertCircle} color="#ef4444" />
        </div>
      )}

      <div className="dashboard-grid flex flex-col gap-4">
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1rem' }}>User</th>
                  <th style={{ padding: '1rem' }}>Role</th>
                  <th style={{ padding: '1rem' }}>Joined</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div className="flex items-center gap-3">
                        <div className="avatar glass-card" style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--glass)' }}>
                          <User size={20} className="text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span style={{ fontWeight: 600 }}>{u.name}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div className="flex justify-end gap-2">
                        <button className="btn-icon" style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-icon" style={{ background: 'transparent', color: 'var(--danger)' }} onClick={() => handleDeleteUser(u.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay flex items-center justify-center" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 100 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '450px' }}>
            <h3>Create New User</h3>
            <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
              <div className="form-group flex flex-col gap-2">
                <label>Full Name</label>
                <input type="text" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} required />
              </div>
              <div className="form-group flex flex-col gap-2">
                <label>Email Address</label>
                <input type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} required />
              </div>
              <div className="form-group flex flex-col gap-2">
                <label>Password</label>
                <input type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} required />
              </div>
              <div className="form-group flex flex-col gap-2">
                <label>System Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                  <option value="USER">User (Standard)</option>
                  <option value="MANAGER">Manager (Task Creator)</option>
                  <option value="ADMIN">Administrator (Full Access)</option>
                </select>
              </div>
              <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create User</button>
                <button type="button" className="btn-secondary" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white' }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
