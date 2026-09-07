import React, { useEffect, useState } from 'react';
import { analyticsAPI, complaintAPI, binAPI } from '../services/api';

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsAPI.getAdminOverview().catch(() => ({ data: null })),
      complaintAPI.getAllComplaints().catch(() => ({ data: [] })),
    ]).then(([ovRes, compRes]) => {
      if (ovRes.data) setOverview(ovRes.data);
      if (compRes.data) setComplaints(compRes.data);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await complaintAPI.updateStatus(id, status);
      const res = await complaintAPI.getAllComplaints();
      setComplaints(res.data);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleSimulateIoT = async () => {
    try {
      await binAPI.simulateBinData();
      alert('IoT Sensor Data Simulated for all smart bins!');
    } catch (err) {
      alert('Simulation failed.');
    }
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Municipal Command Center 🏛️</h1>
          <p style={{ color: 'var(--text-muted)' }}>City-wide IoT waste telemetry, ticket dispatch, and analytics</p>
        </div>
        <button onClick={handleSimulateIoT} className="btn btn-primary">
          ⚡ Trigger IoT Simulation
        </button>
      </div>

      {/* KPI METRICS */}
      <div className="grid-cols-4" style={{ marginBottom: '32px' }}>
        <div className="glass-card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Citizens</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>{overview?.totalUsers || 0}</div>
        </div>
        <div className="glass-card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Smart Bins</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-teal)', marginTop: '4px' }}>
            {overview?.totalBins || 0}
          </div>
        </div>
        <div className="glass-card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Overflowing Bins</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)', marginTop: '4px' }}>
            {overview?.overflowingBins || 0}
          </div>
        </div>
        <div className="glass-card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending Complaints</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '4px' }}>
            {overview?.pendingComplaints || 0}
          </div>
        </div>
      </div>

      {/* COMPLAINTS MANAGEMENT */}
      <div className="glass-card">
        <h3>📋 City Complaints & Dispatch</h3>
        <div style={{ overflowX: 'auto', marginTop: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px' }}>Ticket ID</th>
                <th style={{ padding: '10px' }}>Category</th>
                <th style={{ padding: '10px' }}>User</th>
                <th style={{ padding: '10px' }}>Location</th>
                <th style={{ padding: '10px' }}>Priority</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px', fontWeight: 700, color: 'var(--primary-teal)' }}>{c.ticketId}</td>
                  <td style={{ padding: '10px' }}>{c.category}</td>
                  <td style={{ padding: '10px' }}>{c.userId?.name || 'Citizen'}</td>
                  <td style={{ padding: '10px' }}>{c.location}</td>
                  <td style={{ padding: '10px' }}>
                    <span className={`badge ${c.priority === 'critical' ? 'badge-danger' : c.priority === 'high' ? 'badge-warning' : 'badge-info'}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span className={`badge ${c.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c._id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    >
                      <option value="submitted">Submitted</option>
                      <option value="assigned">Assigned</option>
                      <option value="in-progress">In-Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
