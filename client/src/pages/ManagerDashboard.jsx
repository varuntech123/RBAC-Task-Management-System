import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Clock, CheckCircle2, AlertCircle, User, Calendar, BarChart3, PieChart } from 'lucide-react';
import StatsCard from '../components/StatsCard';

const ManagerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]); // To assign tasks to users
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', assigneeId: '', dueDate: '' });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchData();
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

  const fetchData = async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        axios.get('/api/tasks'),
        axios.get('/api/users') // Note: In a real app, Managers might only see non-admins or their team
      ]);
      setTasks(tasksRes.data);
      setUsers(usersRes.data.filter(u => u.role !== 'ADMIN'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', newTask);
      setShowModal(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', assigneeId: '', dueDate: '' });
      fetchData();
    } catch (err) {
      alert('Error creating task');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 size={16} className="text-success" />;
      case 'IN_PROGRESS': return <Clock size={16} className="text-warning" />;
      default: return <AlertCircle size={16} className="text-muted" />;
    }
  };

  return (
    <div className="manager-dashboard">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Task Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>Create, assign and track progress of team tasks</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Create New Task
        </button>
      </div>

      {stats && (
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <StatsCard title="My Team Tasks" value={stats.totalTasks} icon={BarChart3} color="#6366f1" />
          <StatsCard title="Completed" value={stats.byStatus?.COMPLETED || 0} icon={CheckCircle2} color="#10b981" />
          <StatsCard title="Pending" value={stats.byStatus?.PENDING || 0} icon={Clock} color="#f59e0b" />
          <StatsCard title="High Priority" value={stats.byPriority?.HIGH || 0} icon={AlertCircle} color="#ef4444" />
        </div>
      )}

      <div className="tasks-grid flex flex-col gap-4">
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1rem' }}>Task</th>
                  <th style={{ padding: '1rem' }}>Assignee</th>
                  <th style={{ padding: '1rem' }}>Priority</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div className="flex flex-col">
                        <span style={{ fontWeight: 600 }}>{t.title}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.description || 'No description'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-primary" />
                        <span style={{ fontSize: '0.9rem' }}>{t.assignee?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: t.priority === 'HIGH' ? 'var(--danger)' : t.priority === 'MEDIUM' ? 'var(--warning)' : 'var(--success)' }}>
                        {t.priority}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(t.status)}
                        <span style={{ fontSize: '0.85rem' }}>{t.status.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'}
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
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px' }}>
            <h3>Create & Assign Task</h3>
            <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
              <div className="form-group flex flex-col gap-2">
                <label>Task Title</label>
                <input type="text" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Update security patches" required />
              </div>
              <div className="form-group flex flex-col gap-2">
                <label>Description (Optional)</label>
                <textarea value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} placeholder="Detailed explanation..."></textarea>
              </div>
              <div className="flex gap-4">
                <div className="form-group flex flex-col gap-2" style={{ flex: 1 }}>
                  <label>Priority</label>
                  <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="form-group flex flex-col gap-2" style={{ flex: 1 }}>
                  <label>Due Date</label>
                  <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
              </div>
              <div className="form-group flex flex-col gap-2">
                <label>Assign To</label>
                <select value={newTask.assigneeId} onChange={(e) => setNewTask({...newTask, assigneeId: e.target.value})} required>
                  <option value="">Select a team member</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Task</button>
                <button type="button" className="btn-secondary" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white' }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
