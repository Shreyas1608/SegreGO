import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';

export default function Analytics() {
  const [impact, setImpact] = useState(null);

  useEffect(() => {
    analyticsAPI.getUserImpact()
      .then((res) => setImpact(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="container animate-fade-in">
      <h1 style={{ marginBottom: '8px' }}>Environmental Impact Analytics 🌍</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        Track your personal sustainability metrics, carbon footprint reduction, and segregation accuracy over time.
      </p>

      <div className="grid-cols-4" style={{ marginBottom: '32px' }}>
        <div className="glass-card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Items Classified</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>{impact?.scansCount || 0}</div>
        </div>
        <div className="glass-card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>CO₂ Emissions Avoided</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-teal)', marginTop: '4px' }}>
            {impact?.co2SavedKg || 0} kg
          </div>
        </div>
        <div className="glass-card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Segregation Accuracy</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-green)', marginTop: '4px' }}>
            {impact?.correctSegregationPercent || 94}%
          </div>
        </div>
        <div className="glass-card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Current Level</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '8px' }}>
            {impact?.level || '🌱 Eco Starter'}
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h3>🌱 Sustainability Milestones</h3>
        <ul style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none' }}>
          <li style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>✅</span>
            <div>
              <strong>First Step to Zero Waste</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scanned your first waste item for AI classification.</div>
            </div>
          </li>
          <li style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>✅</span>
            <div>
              <strong>5-Day Segregation Streak</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Maintained daily activity for 5 consecutive days.</div>
            </div>
          </li>
          <li style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>🎯</span>
            <div>
              <strong>Next Goal: Recycling Champion</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reach 300 Eco Points to unlock the next level badge!</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
