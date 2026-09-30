import React, { useEffect, useState } from 'react';
import { centerAPI } from '../services/api';
import InteractiveMap from '../components/InteractiveMap';

export default function NearbyCenters() {
  const [centers, setCenters] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'grid'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    centerAPI.getAllCenters(selectedType)
      .then((res) => setCenters(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedType]);

  const filteredCenters = centers.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q) ||
      c.wasteAccepted?.some((w) => w.toLowerCase().includes(q))
    );
  });

  return (
    <div className="container animate-fade-in">
      {/* HEADER & VIEW TOGGLES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Bengaluru Recycling & DWCC Directory 📍</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Find authorized e-waste hubs, Dry Waste Collection Centers (DWCCs), and compost yards across BBMP wards.
          </p>
        </div>

        {/* VIEW MODE TOGGLE */}
        <div style={{ background: '#e2e8f0', padding: '4px', borderRadius: '10px', display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setViewMode('map')}
            className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 16px', fontSize: '0.85rem', borderRadius: '8px' }}
          >
            🗺️ Interactive Map
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 16px', fontSize: '0.85rem', borderRadius: '8px' }}
          >
            📋 Grid Cards
          </button>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by ward, locality (e.g. Koramangala, Indiranagar)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: '240px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
        />

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { label: 'All Centers', value: '' },
            { label: '♻️ Recyclables / DWCC', value: 'recycling' },
            { label: '⚡ E-Waste', value: 'e-waste' },
            { label: '🌱 Composting', value: 'composting' },
            { label: '☣️ Hazardous', value: 'hazardous' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setSelectedType(item.value)}
              className={`btn ${selectedType === item.value ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* INTERACTIVE LEAFLET MAP VIEW */}
      {viewMode === 'map' && (
        <div style={{ marginBottom: '32px' }}>
          <InteractiveMap items={filteredCenters} type="centers" height="480px" />
        </div>
      )}

      {/* CARD GRID VIEW */}
      {(viewMode === 'grid' || viewMode === 'map') && (
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
            {filteredCenters.length} Centers Found in Bengaluru
          </h2>

          <div className="grid-cols-2">
            {filteredCenters.map((center) => (
              <div key={center._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{center.type}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-green)' }}>{center.distanceKm} km away</span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>{center.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>📍 {center.address}</p>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Accepted Waste Streams:</div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {center.wasteAccepted.map((w, idx) => (
                        <span key={idx} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    🕒 {center.openingHours} • 📞 {center.phone}
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${center.coordinates?.lat || 12.9716},${center.coordinates?.lng || 77.5946}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}
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
