import React, { useEffect, useState } from 'react';
import { collectionAPI } from '../services/api';

export default function Collection() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    collectionAPI.getCollections()
      .then((res) => setCollections(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="container animate-fade-in">
      <h1 style={{ marginBottom: '8px' }}>Municipal Collection Schedule 🚛</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        View door-to-door waste collection schedules for your municipal ward.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {collections.map((item) => (
          <div key={item._id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-info">{item.type}</span>
                <span className="badge badge-success">{item.status}</span>
              </div>
              <h3 style={{ fontSize: '1.1rem' }}>
                {new Date(item.scheduleDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Time: <strong>{item.scheduleTime}</strong> • Vehicle: {item.vehicleNumber}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-teal)' }}>Area: {item.area}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Keep waste bags ready at doorstep</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
