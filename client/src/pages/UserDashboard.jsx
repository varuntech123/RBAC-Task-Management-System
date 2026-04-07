import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, Clock, PlayCircle, AlertCircle, Calendar, MessageSquare, BarChart3 } from 'lucide-react';
import StatsCard from '../components/StatsCard';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchTasks();
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

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('/api/tasks');
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/tasks/${id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const getStatusActionNext = (status) => {
    switch (status) {
      case 'PENDING': return 'IN_PROGRESS';
      case 'IN_PROGRESS': return 'COMPLETED';
      default: return null;
    }
  };

  return (
    <div className="user-dashboard">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>My Active Tasks</h2>
        <p style={{ color: 'var(--text-muted)' }}>View and update the status of your assigned assignments</p>
      </div>

      {stats && (
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <StatsCard title="My Workload" value={stats.totalTasks} icon={BarChart3} color="#6366f1" />
          <StatsCard title="Completed" value={stats.byStatus?.COMPLETED || 0} icon={CheckCircle2} color="#10b981" />
          <StatsCard title="In Progress" value={stats.byStatus?.IN_PROGRESS || 0} icon={PlayCircle} color="#f59e0b" />
          <StatsCard title="High Priority" value={stats.byPriority?.HIGH || 0} icon={AlertCircle} color="#ef4444" />
        </div>
      )}

      <div className="tasks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <p>Loading your tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center" style={{ gridColumn: '1 / -1', minHeight: '200px' }}>
            <p style={{ color: 'var(--text-muted)' }}>No tasks assigned yet. You're all caught up!</p>
          </div>
        ) : (
          tasks.map((t) => (
            <div key={t.id} className="task-card glass-card flex flex-col justify-between" style={{ padding: '1.5rem', minHeight: '220px' }}>
              <div>
                <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: t.priority === 'HIGH' ? 'var(--danger)' : t.priority === 'MEDIUM' ? 'var(--warning)' : 'var(--success)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {t.priority} PRIORITY
                  </span>
                  <div className="flex items-center gap-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Calendar size={14} />
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No due date'}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{t.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{t.description || 'No detailed description provided.'}</p>
              </div>

              <div className="task-footer flex justify-between items-center" style={{ paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <div className="flex flex-col">
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Status</span>
                  <div className="flex items-center gap-1" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    {t.status === 'COMPLETED' ? <CheckCircle2 size={16} className="text-success" /> : t.status === 'IN_PROGRESS' ? <PlayCircle size={16} className="text-warning" /> : <Clock size={16} />}
                    {t.status.replace('_', ' ')}
                  </div>
                </div>

                {getStatusActionNext(t.status) && (
                  <button 
                    className="btn-primary" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    onClick={() => handleUpdateStatus(t.id, getStatusActionNext(t.status))}
                  >
                    Set to {getStatusActionNext(t.status).replace('_', ' ')}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
