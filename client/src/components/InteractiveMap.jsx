import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet icon assets in Vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper component to center map dynamically
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// Custom Colored SVG Marker Pins
const createCustomPin = (color, emoji) => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div style="
        background: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        <span style="transform: rotate(45deg); font-size: 16px;">${emoji}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32],
  });
};

const BENGALURU_CENTER = [12.9716, 77.5946];

export default function InteractiveMap({ items = [], type = 'bins', height = '450px' }) {
  const [mapCenter, setMapCenter] = useState(BENGALURU_CENTER);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [userPos, setUserPos] = useState(null);
  const [geoError, setGeoError] = useState('');

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        setMapCenter(coords);
        setZoomLevel(14);
        setGeoError('');
      },
      () => {
        setGeoError('Could not fetch live location. Defaulting to Bengaluru center.');
      }
    );
  };

  const getBinPin = (bin) => {
    if (bin.fillLevel >= 90) return createCustomPin('#dc2626', '🔴');
    if (bin.fillLevel >= 70) return createCustomPin('#d97706', '🟡');
    return createCustomPin('#16a34a', '🟢');
  };

  const getCenterPin = (center) => {
    if (center.type === 'e-waste') return createCustomPin('#7c3aed', '⚡');
    if (center.type === 'composting') return createCustomPin('#16a34a', '🌱');
    if (center.type === 'hazardous') return createCustomPin('#b91c1c', '☣️');
    return createCustomPin('#0284c7', '🔵');
  };

  return (
    <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: 'var(--shadow-md)' }}>
      {/* MAP CONTROLS BAR */}
      <div style={{
        position: 'absolute', top: '12px', right: '12px', zIndex: 1000,
        display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.92)',
        padding: '6px 12px', borderRadius: '20px', backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <button
          onClick={handleLocateUser}
          style={{
            background: 'none', border: 'none', color: 'var(--primary-green)',
            fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
          }}
        >
          📍 Locate Near Me
        </button>
      </div>

      {geoError && (
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 1000, background: '#fee2e2', color: '#991b1b', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem' }}>
          ⚠️ {geoError}
        </div>
      )}

      {/* LEAFLET MAP CONTAINER */}
      <MapContainer center={mapCenter} zoom={zoomLevel} style={{ height, width: '100%' }}>
        <ChangeView center={mapCenter} zoom={zoomLevel} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* USER POSITION MARKER */}
        {userPos && (
          <Marker position={userPos} icon={createCustomPin('#2563eb', '📍')}>
            <Popup>
              <div style={{ padding: '4px' }}>
                <strong>📍 Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* BINS OR RECYCLING CENTERS MARKERS */}
        {items.map((item, idx) => {
          const lat = item.coordinates?.lat || (12.9 + idx * 0.02);
          const lng = item.coordinates?.lng || (77.6 + idx * 0.02);
          const pos = [lat, lng];

          if (type === 'bins') {
            return (
              <Marker key={item.binId || idx} position={pos} icon={getBinPin(item)}>
                <Popup width={240}>
                  <div style={{ padding: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{item.binId}</strong>
                      <span className={`badge ${item.fillLevel >= 90 ? 'badge-danger' : item.fillLevel >= 70 ? 'badge-warning' : 'badge-success'}`}>
                        {item.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.locationName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{item.area}</div>

                    {/* Fill meter */}
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                        <span>Fill Level</span>
                        <span>{item.fillLevel}%</span>
                      </div>
                      <div style={{ background: '#e2e8f0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${item.fillLevel}%`, height: '100%',
                          background: item.fillLevel >= 90 ? '#dc2626' : item.fillLevel >= 70 ? '#d97706' : '#16a34a'
                        }} />
                      </div>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '10px' }}>
                      🌡️ {item.temperature}°C • 🔋 {item.batteryLevel}% • 📡 {item.deviceId}
                    </div>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ display: 'block', textAlign: 'center', padding: '6px', fontSize: '0.75rem', borderRadius: '6px', textDecoration: 'none', color: 'white' }}
                    >
                      🗺️ Get Directions in Google Maps
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          }

          // Recycling Centers
          return (
            <Marker key={item._id || idx} position={pos} icon={getCenterPin(item)}>
              <Popup width={260}>
                <div style={{ padding: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{item.type}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-green)' }}>{item.distanceKm} km</span>
                  </div>

                  <strong style={{ fontSize: '0.95rem', display: 'block', marginBottom: '4px' }}>{item.name}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>📍 {item.address}</div>

                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>Accepted Waste:</div>
                    <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginTop: '2px' }}>
                      {item.wasteAccepted?.map((w, i) => (
                        <span key={i} style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem' }}>
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    🕒 {item.openingHours} • 📞 {item.phone}
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ display: 'block', textAlign: 'center', padding: '6px', fontSize: '0.75rem', borderRadius: '6px', textDecoration: 'none', color: 'white' }}
                  >
                    🗺️ Get Directions in Google Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
