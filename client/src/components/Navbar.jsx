import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';

export default function Navbar() {
  const { user, isAuthenticated, logout, switchUserRole } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      notificationAPI.getNotifications()
        .then((res) => setUnreadCount(res.data.unreadCount || 0))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRoleSwitch = async () => {
    setSwitching(true);
    try {
      const updatedUser = await switchUserRole();
      if (updatedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Role switch failed');
    } finally {
      setSwitching(false);
    }
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)', padding: '12px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.5rem' }}>🌿</span>
        <span className="text-gradient" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>SEGREGO</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            <Link to="/ai-detect" style={linkStyle}>AI Detect</Link>
            <Link to="/bins" style={linkStyle}>Smart Bins</Link>
            <Link to="/rewards" style={linkStyle}>Rewards</Link>
            <Link to="/complaints" style={linkStyle}>Report Issue</Link>
            <Link to="/centers" style={linkStyle}>Centers</Link>

            {user?.role === 'admin' ? (
              <Link to="/admin" style={{ ...linkStyle, color: '#0d9488', fontWeight: 800, background: '#ccfbf1', padding: '4px 10px', borderRadius: '6px' }}>
                🏛️ Admin Console
              </Link>
            ) : null}

            {/* QUICK ROLE SWITCHER FOR DEMO/TESTING */}
            <button
              onClick={handleRoleSwitch}
              disabled={switching}
              style={{
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: user?.role === 'admin' ? '1px solid #0d9488' : '1px solid #cbd5e1',
                background: user?.role === 'admin' ? '#f0fdf4' : '#f8fafc',
                color: user?.role === 'admin' ? '#0d9488' : '#475569',
                cursor: 'pointer',
              }}
              title="Click to toggle between Citizen and Admin mode for testing"
            >
              {user?.role === 'admin' ? '👑 Mode: Admin' : '👤 Mode: Citizen (Switch to Admin)'}
            </button>

            {/* USER PROFILE DROPDOWN */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-green), var(--primary-teal))',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, cursor: 'pointer', userSelect: 'none'
                }}
              >
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>

              {showDropdown && (
                <div style={{
                  position: 'absolute', right: 0, top: '44px', width: '200px',
                  background: 'white', borderRadius: 'var(--radius-sm)', padding: '8px 0',
                  boxShadow: 'var(--shadow-lg)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role: <strong>{user?.role}</strong></div>
                  </div>
                  {user?.role === 'admin' && (
                    <Link to="/admin" style={dropdownLinkStyle} onClick={() => setShowDropdown(false)}>🏛️ Admin Console</Link>
                  )}
                  <Link to="/analytics" style={dropdownLinkStyle} onClick={() => setShowDropdown(false)}>My Analytics</Link>
                  <button onClick={handleLogout} style={{ ...dropdownLinkStyle, color: 'var(--danger)', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', width: '100%' }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  textDecoration: 'none',
  color: 'var(--text-main)',
  fontWeight: 600,
  fontSize: '0.85rem',
  transition: 'color 0.2s',
};

const dropdownLinkStyle = {
  padding: '8px 16px',
  fontSize: '0.875rem',
  color: 'var(--text-main)',
  textDecoration: 'none',
  display: 'block',
};
