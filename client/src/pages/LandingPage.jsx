import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #0f766e 100%)',
        color: 'white', padding: '100px 20px', textAlign: 'center', position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span className="badge badge-success" style={{ marginBottom: '16px', fontSize: '0.85rem' }}>
            🌿 AI-Powered Smart City Waste Platform
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '20px', lineHeight: '1.2' }}>
            Smarter Waste. Cleaner Cities. <span style={{ color: '#2dd4bf' }}>Greener Future.</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#cbd5e1', marginBottom: '36px', lineHeight: '1.6' }}>
            Transforming urban waste management with instant AI waste classification, IoT smart bin tracking, civic reporting, and citizen reward incentives.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/ai-detect" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
              🤖 Try AI Scanner
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
              🚀 Join Platform
            </Link>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="container">
        <div className="grid-cols-4">
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }} className="text-gradient">10,000+</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Active Citizens</div>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }} className="text-gradient">500+</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>IoT Smart Bins</div>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }} className="text-gradient">98%</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>AI Accuracy</div>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }} className="text-gradient">50 Tons</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Waste Diverted</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container" style={{ paddingTop: '20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem' }}>How SEGREGO Works</h2>
        <div className="grid-cols-3">
          <div className="glass-card">
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📷</div>
            <h3>1. Scan Waste</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
              Take a photo of any item. Our computer vision model classifies it in milliseconds into 10+ categories.
            </p>
          </div>
          <div className="glass-card">
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📡</div>
            <h3>2. IoT Bin Tracking</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
              Locate the nearest smart bin. Real-time ultrasonic sensors monitor fill levels to prevent overflows.
            </p>
          </div>
          <div className="glass-card">
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🏆</div>
            <h3>3. Earn Eco Rewards</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
              Get rewarded with Eco Points for proper segregation. Level up from Eco Starter to Sustainability Leader!
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ background: '#f1f5f9', padding: '60px 20px', textAlign: 'center', marginTop: '60px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2>Ready to Build a Zero-Waste City?</h2>
          <p style={{ color: 'var(--text-muted)', margin: '16px 0 24px' }}>
            Start segregating waste intelligently today and earn rewards while helping your city stay clean.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ padding: '12px 24px' }}>Create Free Account</Link>
        </div>
      </section>
    </div>
  );
}
