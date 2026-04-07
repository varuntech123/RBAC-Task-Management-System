import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, CheckSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar glass-card">
      <div className="nav-container flex justify-between items-center">
        <Link to="/" className="nav-logo flex items-center gap-2">
          <CheckSquare className="text-primary" />
          <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>TaskControl</span>
        </Link>
        <div className="nav-links flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <div className="user-profile flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user.name}</span>
              <span className={`badge badge-${user.role.toLowerCase()}`}>{user.role}</span>
            </div>
            <button onClick={onLogout} className="btn-logout flex items-center gap-2">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
