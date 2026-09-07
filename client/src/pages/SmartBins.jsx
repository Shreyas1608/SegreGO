import React, { useEffect, useState } from 'react';
import { binAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SmartBins() {
  const { user } = useAuth();
  const [bins, setBins] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchBins = () => {
    binAPI.getAllBins()
      .then((res) => setBins(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBins();
    const interval = setInterval(fetchBins, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleSimulate = async () => {
    try {
      await binAPI.simulateBinData();
      fetchBins();
    } catch (err) {
      alert('Simulation failed.');
    }
  };

  const filteredBins = bins.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Smart IoT Bins 📡</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time ultrasonic bin fill monitoring across urban zones</p>
        </div>

        {user?.role === 'admin' && (
          <button onClick={handleSimulate} className="btn btn-secondary">
            ⚡ Simulate IoT Sensor Updates
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'available', 'almost-full', 'full'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`btn ${filter === st ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.85rem', textTransform: 'capitalize' }}
          >
            {st} ({st === 'all' ? bins.length : bins.filter((b) => b.status === st).length})
          </button>
        ))}
      </div>

      {/* BINS GRID */}
      <div className="grid-cols-3">
        {filteredBins.map((bin) => (
          <div key={bin.binId} className="glass-card" style={{
            borderLeft: `6px solid ${bin.fillLevel >= 90 ? 'var(--danger)' : bin.fillLevel >= 70 ? 'var(--accent-gold)' : 'var(--success)'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{bin.binId}</span>
              <span className={`badge ${bin.fillLevel >= 90 ? 'badge-danger' : bin.fillLevel >= 70 ? 'badge-warning' : 'badge-success'}`}>
                {bin.status}
              </span>
            </div>

            <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>{bin.locationName}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Area: {bin.area} • Type: <strong style={{ textTransform: 'capitalize' }}>{bin.type}</strong>
            </div>

            {/* FILL METER */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 600 }}>
                <span>Fill Level</span>
                <span>{bin.fillLevel}%</span>
              </div>
              <div style={{ background: '#e2e8f0', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{
                  width: `${bin.fillLevel}%`, height: '100%',
                  background: bin.fillLevel >= 90 ? 'var(--danger)' : bin.fillLevel >= 70 ? 'var(--accent-gold)' : 'var(--success)',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            {/* METRICS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
              <span>🌡️ {bin.temperature}°C</span>
              <span>🔋 {bin.batteryLevel}%</span>
              <span>📡 {bin.deviceId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
