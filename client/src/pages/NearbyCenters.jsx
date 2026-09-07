import React, { useEffect, useState } from 'react';
import { centerAPI } from '../services/api';

export default function NearbyCenters() {
  const [centers, setCenters] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    centerAPI.getAllCenters(selectedType)
      .then((res) => setCenters(res.data))
      .catch(() => {});
  }, [selectedType]);

  return (
    <div className="container animate-fade-in">
      <h1 style={{ marginBottom: '8px' }}>Nearby Recycling Centers 📍</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        Find authorized e-waste, hazardous, plastic, and composting facilities near you.
      </p>

      {/* TYPE FILTER */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['', 'recycling', 'e-waste', 'composting', 'hazardous'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`btn ${selectedType === type ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.85rem', textTransform: 'capitalize' }}
          >
            {type === '' ? 'All Types' : type}
          </button>
        ))}
      </div>

      <div className="grid-cols-2">
        {centers.map((center) => (
          <div key={center._id} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge badge-info">{center.type}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-green)' }}>{center.distanceKm} km away</span>
            </div>

            <h3 style={{ marginBottom: '6px' }}>{center.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>📍 {center.address}</p>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>Accepted Waste Types:</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {center.wasteAccepted.map((w, idx) => (
                  <span key={idx} style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                    {w}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
              🕒 {center.openingHours} • 📞 {center.phone}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
