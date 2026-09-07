import React, { useState, useRef } from 'react';
import { scanAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { analyzeImagePixels } from '../utils/imageClassifier';

const WASTE_TAGS = [
  { label: '🥗 Wet / Food Waste', value: 'Biodegradable' },
  { label: '🥤 Plastic (Bottles/Wrappers)', value: 'Plastic' },
  { label: '📦 Paper & Cardboard', value: 'Paper' },
  { label: '🍾 Glass', value: 'Glass' },
  { label: '🥫 Metal / Aluminium Can', value: 'Metal' },
  { label: '💻 E-Waste (Phones/Electronics)', value: 'E-Waste' },
  { label: '🔋 Hazardous (Batteries/Chemicals)', value: 'Hazardous' },
  { label: '💊 Medical Waste', value: 'Medical' },
  { label: '👕 Textile / Clothes', value: 'Textile' },
];

const CATEGORY_COLORS = {
  Biodegradable: '#15803d',
  Plastic: '#0284c7',
  Paper: '#92400e',
  Glass: '#7c3aed',
  Metal: '#475569',
  'E-Waste': '#b45309',
  Hazardous: '#dc2626',
  Medical: '#be185d',
  Textile: '#c2410c',
};

export default function AIDetect() {
  const { updateUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [userTag, setUserTag] = useState('');
  const [visualResult, setVisualResult] = useState(null);
  const [analyzingVisual, setAnalyzingVisual] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError('Image size must be under 8MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setResult(null);
    setError('');
    setUserTag('');
    setVisualResult(null);
    setAnalyzingVisual(true);

    // Run client-side computer vision pixel analysis
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const visual = analyzeImagePixels(img);
      setVisualResult(visual);
      setAnalyzingVisual(false);

      // Pre-select visual category
      if (visual && visual.category) {
        setUserTag(visual.category);
      }
    };
    img.onerror = () => {
      setAnalyzingVisual(false);
    };
    img.src = objectUrl;
  };

  const handleClassify = async () => {
    if (!selectedFile) {
      setError('Please select or take a waste photo first.');
      return;
    }

    setLoading(true);
    setError('');

    // Generate unique image hash to prevent duplicates in current scan
    const imageHash = `${selectedFile.name}-${selectedFile.size}-${Date.now()}`;

    try {
      const payload = {
        imageHash,
        fileName: selectedFile.name,
        userTag: userTag || undefined,
        visualCategory: visualResult?.category || undefined,
        visualConfidence: visualResult?.confidence || undefined,
        visualStats: visualResult ? {
          organicPercent: visualResult.organicPercent,
          plasticPercent: visualResult.plasticPercent,
          avgColor: visualResult.avgColor,
        } : undefined,
      };

      const res = await scanAPI.classifyWaste(payload);
      setResult(res.data);

      if (res.data.userPoints) {
        updateUser({ points: res.data.userPoints, level: res.data.userLevel });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Classification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError('');
    setUserTag('');
    setVisualResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const activeCategory = result?.category || userTag || visualResult?.category || 'Biodegradable';
  const categoryColor = CATEGORY_COLORS[activeCategory] || '#059669';

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '820px' }}>
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem' }}>AI Waste Classifier 🤖</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.95rem' }}>
          Computer vision detection for Wet Waste, Recyclables, Plastic, Paper, Glass, and E-Waste.
        </p>
      </div>

      {/* UPLOAD CARD */}
      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${selectedFile ? 'var(--primary-green)' : '#cbd5e1'}`,
            borderRadius: '12px',
            padding: selectedFile ? '20px' : '36px 20px',
            textAlign: 'center',
            background: selectedFile ? '#f0fdf4' : '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {previewUrl ? (
            <div>
              <img
                src={previewUrl}
                alt="Selected Waste"
                style={{
                  maxHeight: '240px',
                  maxWidth: '100%',
                  borderRadius: '10px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  marginBottom: '12px',
                }}
              />
              <div style={{ fontSize: '0.85rem', color: 'var(--primary-green)', fontWeight: 600 }}>
                ✅ Selected: {selectedFile?.name} (Click to change)
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>📸</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Click or Drag Image Here to Scan</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Supports wet waste, plastic bottles, paper, cans, e-waste, and more
              </div>
            </div>
          )}
        </div>

        {/* VISUAL ANALYSIS BADGE */}
        {analyzingVisual && (
          <div style={{ marginTop: '12px', padding: '10px', background: '#f0fdf4', borderRadius: '8px', fontSize: '0.85rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔍</span> Running visual pixel inspection...
          </div>
        )}

        {visualResult && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            background: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.3rem' }}>
                {visualResult.category === 'Biodegradable' ? '🥗' : visualResult.category === 'Plastic' ? '🥤' : '📦'}
              </span>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Computer Vision Detection
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {visualResult.category === 'Biodegradable' ? 'Wet / Organic Waste' : visualResult.category}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: visualResult.avgColor,
                border: '1px solid #cbd5e1',
                title: 'Dominant Color'
              }} />
              <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                {Math.round(visualResult.confidence * 100)}% Match
              </span>
            </div>
          </div>
        )}

        {/* MANUAL OVERRIDE CHIPS */}
        {selectedFile && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
              Confirm or select category:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {WASTE_TAGS.map((t) => {
                const isSelected = userTag === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setUserTag(t.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      border: `1.5px solid ${isSelected ? CATEGORY_COLORS[t.value] || '#059669' : '#e2e8f0'}`,
                      background: isSelected ? (CATEGORY_COLORS[t.value] || '#059669') : 'white',
                      color: isSelected ? 'white' : 'var(--text-main)',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', marginTop: '16px', fontSize: '0.875rem' }}>
            ⚠️ {error}
          </div>
        )}

        {/* CLASSIFY ACTION */}
        {selectedFile && !result && (
          <button
            onClick={handleClassify}
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '20px', padding: '14px', fontSize: '1.05rem', borderRadius: '10px' }}
          >
            {loading ? 'Analyzing & Verifying Waste...' : '🔍 Classify Waste'}
          </button>
        )}
      </div>

      {/* CLASSIFICATION RESULT CARD */}
      {result && (
        <div className="glass-card animate-fade-in" style={{ borderLeft: `6px solid ${categoryColor}`, marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: categoryColor,
                color: 'white',
                padding: '4px 14px',
                borderRadius: '30px',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {result.category === 'Biodegradable' ? '🟢 Wet Waste (Biodegradable)' : result.category}
              </span>
              <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', color: 'var(--text-muted)' }}>
                {result.detectionMethod}
              </span>
            </div>

            <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1.05rem' }}>
              +{result.pointsAwarded} Eco Points 🏆
            </span>
          </div>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{result.material}</h2>

          {/* CONFIDENCE BAR */}
          <div style={{ margin: '14px 0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Classification Confidence</span>
              <span style={{ fontWeight: 700, color: categoryColor }}>{Math.round(result.confidence * 100)}%</span>
            </div>
            <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.round(result.confidence * 100)}%`,
                height: '100%',
                background: categoryColor,
                borderRadius: '4px',
                transition: 'width 0.8s ease',
              }} />
            </div>
          </div>

          {/* RECOMMENDED DISPOSAL BIN */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ color: 'var(--primary-teal)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
              📍 RECOMMENDED DISPOSAL
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: '6px' }}>
              {result.recommendedBin}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
              {result.disposalInstructions}
            </p>
          </div>

          {/* ENVIRONMENTAL IMPACT */}
          <div style={{ background: '#e0f2fe', padding: '12px 16px', borderRadius: '10px', fontSize: '0.85rem', color: '#0369a1', marginBottom: '20px' }}>
            <strong>🌱 Environmental Impact:</strong> {result.environmentalImpact}
          </div>

          <button onClick={handleReset} className="btn btn-secondary" style={{ width: '100%' }}>
            🔄 Scan Another Item
          </button>
        </div>
      )}

      {/* QUICK REFERENCE BINS */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Municipal Color-Coded Segregation Guide</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '8px' }}>
            <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.85rem' }}>🟢 Green Bin</div>
            <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '2px' }}>Food waste, vegetable/fruit peels, tea leaves, leftovers, garden waste</div>
          </div>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px', borderRadius: '8px' }}>
            <div style={{ fontWeight: 700, color: '#1d4ed8', fontSize: '0.85rem' }}>🔵 Blue Bin</div>
            <div style={{ fontSize: '0.75rem', color: '#1e40af', marginTop: '2px' }}>Dry plastic bottles, cardboard, paper, metal cans, glass jars</div>
          </div>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px', borderRadius: '8px' }}>
            <div style={{ fontWeight: 700, color: '#b91c1c', fontSize: '0.85rem' }}>🔴 Red Bin</div>
            <div style={{ fontSize: '0.75rem', color: '#991b1b', marginTop: '2px' }}>E-waste, electronics, batteries, toxic household chemicals, paints</div>
          </div>
        </div>
      </div>
    </div>
  );
}
