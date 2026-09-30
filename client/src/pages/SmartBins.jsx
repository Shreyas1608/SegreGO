import React, { useEffect, useState } from 'react';
import { binAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import InteractiveMap from '../components/InteractiveMap';

export default function SmartBins() {
  const { user } = useAuth();
  const [bins, setBins] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'grid'
  const [loading, setLoading] = useState(true);

  const fetchBins = () => {
    binAPI.getAllBins()
      .then((res) => setBins(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBins();
    const interval = setInterval(fetchBins, 10000); // refresh telemetry every 10s
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
    const matchesFilter = filter === 'all' || b.status === filter;
    const matchesQuery = !searchQuery || (
      b.binId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.area.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="container animate-fade-in">
      {/* HEADER & CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Smart IoT Bin Telemetry 📡</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Real-time ultrasonic fill level monitoring across BBMP Bengaluru municipal wards.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* VIEW TOGGLE */}
          <div style={{ background: '#e2e8f0', padding: '4px', borderRadius: '10px', display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setViewMode('map')}
              className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '0.85rem', borderRadius: '8px' }}
            >
              🗺️ Map View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '0.85rem', borderRadius: '8px' }}
            >
              📋 Grid View
            </button>
          </div>

          {user?.role === 'admin' && (
            <button onClick={handleSimulate} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              ⚡ Simulate IoT Sensor Updates
            </button>
          )}
        </div>
      </div>

      {/* SEARCH & STATUS FILTERS */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by bin ID, locality, or ward (e.g. Koramangala, Indiranagar)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: '240px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
        />

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all', 'available', 'almost-full', 'full'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`btn ${filter === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 14px', fontSize: '0.85rem', textTransform: 'capitalize' }}
            >
              {st} ({st === 'all' ? bins.length : bins.filter((b) => b.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* INTERACTIVE LEAFLET MAP VIEW */}
      {viewMode === 'map' && (
        <div style={{ marginBottom: '32px' }}>
          <InteractiveMap items={filteredBins} type="bins" height="480px" />
        </div>
      )}

      {/* GRID VIEW */}
      {(viewMode === 'grid' || viewMode === 'map') && (
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
            {filteredBins.length} Smart Bins Monitored
          </h2>

          <div className="grid-cols-3">
            {filteredBins.map((bin) => (
              <div key={bin.binId} className="glass-card" style={{
                borderLeft: `6px solid ${bin.fillLevel >= 90 ? 'var(--danger)' : bin.fillLevel >= 70 ? 'var(--accent-gold)' : 'var(--success)'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{bin.binId}</span>
                  <span className={`badge ${bin.fillLevel >= 90 ? 'badge-danger' : bin.fillLevel >= 70 ? 'badge-warning' : 'badge-success'}`}>
                    {bin.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '2px' }}>{bin.locationName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Area: {bin.area} • Type: <strong style={{ textTransform: 'capitalize' }}>{bin.type}</strong>
                </div>

                {/* FILL METER */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 700 }}>
                    <span>Fill Level</span>
                    <span style={{ color: bin.fillLevel >= 90 ? 'var(--danger)' : bin.fillLevel >= 70 ? 'var(--accent-gold)' : 'var(--success)' }}>
                      {bin.fillLevel}%
                    </span>
                  </div>
                  <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${bin.fillLevel}%`, height: '100%',
                      background: bin.fillLevel >= 90 ? 'var(--danger)' : bin.fillLevel >= 70 ? 'var(--accent-gold)' : 'var(--success)',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>

                {/* METRICS & DIRECTIONS */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>🌡️ {bin.temperature}°C • 🔋 {bin.batteryLevel}%</span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${bin.coordinates?.lat || 12.9716},${bin.coordinates?.lng || 77.5946}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'var(--primary-teal)', fontWeight: 700 }}
                  >
                    🗺️ Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
