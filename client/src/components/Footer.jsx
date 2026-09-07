import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: '#0f172a', color: '#94a3b8', padding: '40px 20px 20px',
      marginTop: 'auto', borderTop: '1px solid #1e293b'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: '12px' }}>
            <span>🌿</span> SEGREGO
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
          AI-Powered Smart Waste Segregation & Sustainable Urban Waste Management Platform.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '12px' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
            <Link to="/ai-detect" style={footerLink}>AI Waste Scanner</Link>
            <Link to="/bins" style={footerLink}>Smart IoT Bins</Link>
            <Link to="/rewards" style={footerLink}>Eco Rewards</Link>
            <Link to="/education" style={footerLink}>Waste Guide & Quiz</Link>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '12px' }}>Municipal & IoT</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
            <Link to="/complaints" style={footerLink}>Report Waste Issue</Link>
            <Link to="/collection" style={footerLink}>Collection Schedule</Link>
            <Link to="/centers" style={footerLink}>Recycling Centers</Link>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '12px' }}>Sustainability</h4>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
            Empowering citizens and municipal authorities for a 100% segregated, zero-waste smart city.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1240px', margin: '32px auto 0', paddingTop: '20px', borderTop: '1px solid #1e293b', textAlign: 'center', fontSize: '0.75rem' }}>
        © {new Date().getFullYear()} SEGREGO Platform. Built for Sustainable Smart Cities.
      </div>
    </footer>
  );
}

const footerLink = {
  color: '#94a3b8',
  textDecoration: 'none',
  transition: 'color 0.2s',
};
