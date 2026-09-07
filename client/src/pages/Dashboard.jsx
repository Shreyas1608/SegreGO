import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, collectionAPI, binAPI } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [impact, setImpact] = useState(null);
  const [upcoming, setUpcoming] = useState(null);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsAPI.getUserImpact().catch(() => ({ data: null })),
      collectionAPI.getUpcoming().catch(() => ({ data: null })),
      binAPI.getAllBins().catch(() => ({ data: [] })),
    ]).then(([impRes, upRes, binRes]) => {
      if (impRes.data) setImpact(impRes.data);
      if (upRes.data) setUpcoming(upRes.data);
      if (binRes.data) setBins(binRes.data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  return (
    <div className="container animate-fade-in">
      {/* GREETING */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Welcome back, {user?.name} 🌱</h1>
          <p style={{ color: 'var(--text-muted)' }}>Level: <strong>{user?.level}</strong> • Keep up the great segregation streak!</p>
        </div>
        <Link to="/ai-detect" className="btn btn-primary">
          📷 AI Waste Scanner
        </Link>
      </div>

      {/* IMPACT CARDS */}
      <div className="grid-cols-4" style={{ marginBottom: '32px' }}>
        <div className="glass-card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Eco Points</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-green)', marginTop: '4px' }}>
            {impact?.points ?? user?.points ?? 0} 🏆
          </div>
        </div>
        <div className="glass-card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Items Sorted</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px' }}>
            {impact?.scansCount ?? user?.scansCount ?? 0} ♻️
          </div>
        </div>
        <div className="glass-card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>CO₂ Diverted</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-teal)', marginTop: '4px' }}>
            {impact?.co2SavedKg ?? user?.co2SavedKg ?? 0} kg 🍃
          </div>
        </div>
        <div className="glass-card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Streak</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '4px' }}>
            {impact?.streakDays ?? user?.streakDays ?? 1} Days 🔥
          </div>
        </div>
      </div>

      <div className="grid-cols-2" style={{ marginBottom: '32px' }}>
        {/* UPCOMING COLLECTION */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3>🚛 Next Collection</h3>
            <Link to="/collection" style={{ fontSize: '0.85rem', color: 'var(--primary-teal)', textDecoration: 'none', fontWeight: 600 }}>Schedule</Link>
          </div>
          {upcoming ? (
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-info">{upcoming.type}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{upcoming.scheduleTime}</span>
              </div>
              <div style={{ fontWeight: 700, marginTop: '8px', fontSize: '1.05rem' }}>
                {new Date(upcoming.scheduleDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Area: {upcoming.area}</div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No upcoming collections scheduled for your area.</p>
          )}
        </div>

        {/* RECENT REWARDS FEED */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3>🎁 Recent Activity</h3>
            <Link to="/rewards" style={{ fontSize: '0.85rem', color: 'var(--primary-teal)', textDecoration: 'none', fontWeight: 600 }}>View All</Link>
          </div>
          {impact?.recentTransactions?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {impact.recentTransactions.map((tx) => (
                <div key={tx._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{tx.action}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.reason}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: tx.points > 0 ? 'var(--success)' : 'var(--danger)' }}>
                    +{tx.points} pts
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No activity yet. Scan your first waste item to earn points!</p>
          )}
        </div>
      </div>

      {/* NEARBY SMART BINS */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>📡 Nearby Smart Bins</h3>
          <Link to="/bins" style={{ fontSize: '0.85rem', color: 'var(--primary-teal)', textDecoration: 'none', fontWeight: 600 }}>Map View</Link>
        </div>
        <div className="grid-cols-3">
          {bins.map((bin) => (
            <div key={bin.binId} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{bin.locationName}</span>
                <span className={`badge ${bin.status === 'full' ? 'badge-danger' : bin.status === 'almost-full' ? 'badge-warning' : 'badge-success'}`}>
                  {bin.fillLevel}%
                </span>
              </div>
              <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${bin.fillLevel}%`, height: '100%',
                  background: bin.fillLevel >= 90 ? 'var(--danger)' : bin.fillLevel >= 70 ? 'var(--accent-gold)' : 'var(--success)'
                }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Type: {bin.type} • ID: {bin.binId}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
