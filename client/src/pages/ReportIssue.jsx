import React, { useEffect, useState } from 'react';
import { complaintAPI } from '../services/api';

export default function ReportIssue() {
  const [complaints, setComplaints] = useState([]);
  const [category, setCategory] = useState('garbage-overflow');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchMyComplaints = () => {
    complaintAPI.getMyComplaints()
      .then((res) => setComplaints(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await complaintAPI.createComplaint({ category, description, priority, location });
      setSuccessMsg(`Complaint submitted! Ticket ID: ${res.data.ticketId}`);
      setDescription('');
      setLocation('');
      fetchMyComplaints();
    } catch (err) {
      alert('Failed to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      <h1 style={{ marginBottom: '8px' }}>Civic Issue Reporting 🎫</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        Report waste overflows, illegal dumping, or damaged bins directly to municipal authorities.
      </p>

      <div className="grid-cols-2">
        {/* FORM */}
        <div className="glass-card">
          <h3>Submit New Ticket</h3>
          {successMsg && (
            <div style={{ background: '#d1fae5', color: '#065f46', padding: '12px', borderRadius: '8px', margin: '16px 0', fontSize: '0.875rem' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label>Issue Category</label>
              <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="garbage-overflow">Garbage Bin Overflow</option>
                <option value="illegal-dumping">Illegal Waste Dumping</option>
                <option value="missed-collection">Missed Door-to-Door Collection</option>
                <option value="damaged-bin">Damaged Smart Bin</option>
                <option value="hazardous-waste">Unattended Hazardous Waste</option>
                <option value="cleanliness">General Street Cleanliness</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location / Landmark</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Near Bus Stand, Koramangala 4th Block"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Priority Level</label>
              <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical / Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description of Issue</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Provide details about the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Submitting Ticket...' : 'Submit Complaint'}
            </button>
          </form>
        </div>

        {/* MY TICKETS */}
        <div className="glass-card">
          <h3>My Reported Tickets</h3>
          {complaints.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {complaints.map((c) => (
                <div key={c._id} style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-teal)', fontSize: '0.9rem' }}>{c.ticketId}</span>
                    <span className={`badge ${c.status === 'resolved' ? 'badge-success' : c.status === 'in-progress' ? 'badge-info' : 'badge-warning'}`}>
                      {c.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{c.category}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0' }}>{c.location}</div>
                  <p style={{ fontSize: '0.85rem', color: '#334155' }}>{c.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '16px' }}>
              No complaints reported yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
