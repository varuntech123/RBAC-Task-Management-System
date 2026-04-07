import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import UserDashboard from './UserDashboard';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user.role) {
      case 'ADMIN': return <AdminDashboard />;
      case 'MANAGER': return <ManagerDashboard />;
      case 'USER': return <UserDashboard />;
      default: return <div>Unauthorized</div>;
    }
  };

  return (
    <div className="dashboard-layout min-h-screen">
      <Navbar />
      <main className="container" style={{ paddingTop: '2rem' }}>
        <div className="welcome-section flex items-center gap-4" style={{ marginBottom: '3rem' }}>
          <div className="avatar-large glass-card flex items-center justify-center" style={{ width: '64px', height: '64px', borderRadius: '16px', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Welcome back, {user.name.split(' ')[0]}!</h1>
            <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your projects today.</p>
          </div>
        </div>
        
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Dashboard;
