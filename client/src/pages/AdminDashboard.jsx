import React, { useEffect, useState } from 'react';
import { analyticsAPI, complaintAPI, binAPI, centerAPI, authAPI, rewardAPI } from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data states
  const [overview, setOverview] = useState(null);
  const [bins, setBins] = useState([]);
  const [centers, setCenters] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ticket inspection & resolution modal state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketForm, setTicketForm] = useState({ status: 'assigned', assignedOfficer: '', resolutionNote: '' });

  // Modal / Form states for Bins, Centers, Vouchers
  const [showBinModal, setShowBinModal] = useState(false);
  const [binForm, setBinForm] = useState({ binId: '', locationName: '', area: 'Central Zone', type: 'recyclable', fillLevel: 0, lat: 12.9716, lng: 77.5946 });

  const [showCenterModal, setShowCenterModal] = useState(false);
  const [centerForm, setCenterForm] = useState({ name: '', type: 'recycling', address: '', wasteAccepted: 'Plastic, Paper, Metal', phone: '+91 80 2297 5555', distanceKm: 1.5, lat: 12.9341, lng: 77.6152 });

  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherForm, setVoucherForm] = useState({ title: '', description: '', pointsCost: 100, category: 'eco-product', icon: '🎟️', discountValue: '₹100 Voucher', terms: 'Valid across Bengaluru.' });

  const [msg, setMsg] = useState('');

  const fetchAllAdminData = () => {
    setLoading(true);
    Promise.all([
      analyticsAPI.getAdminOverview().catch(() => ({ data: null })),
      binAPI.getAllBins().catch(() => ({ data: [] })),
      centerAPI.getAllCenters().catch(() => ({ data: [] })),
      complaintAPI.getAllComplaints().catch(() => ({ data: [] })),
      authAPI.getAllUsers().catch(() => ({ data: [] })),
      rewardAPI.getVouchers().catch(() => ({ data: [] })),
    ]).then(([ovRes, binRes, centerRes, compRes, userRes, vouchRes]) => {
      if (ovRes.data) setOverview(ovRes.data);
      if (binRes.data) setBins(binRes.data);
      if (centerRes.data) setCenters(centerRes.data);
      if (compRes.data) setComplaints(compRes.data);
      if (userRes.data) setUsers(userRes.data);
      if (vouchRes.data) setVouchers(vouchRes.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  const showFeedback = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 4000);
  };

  // ─── Ticket Resolution Handlers ────────────────────────────────────
  const handleOpenTicketModal = (ticket) => {
    setSelectedTicket(ticket);
    setTicketForm({
      status: ticket.status || 'assigned',
      assignedOfficer: ticket.assignedOfficer || '',
      resolutionNote: ticket.resolutionNote || '',
    });
  };

  const handleSaveTicketResolution = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      await complaintAPI.updateStatus(selectedTicket._id, {
        status: ticketForm.status,
        assignedOfficer: ticketForm.assignedOfficer,
        resolutionNote: ticketForm.resolutionNote,
      });

      if (ticketForm.status === 'resolved') {
        showFeedback(`🎉 Ticket ${selectedTicket.ticketId} marked RESOLVED! Citizen awarded +20 Eco Points.`);
      } else {
        showFeedback(`📋 Ticket ${selectedTicket.ticketId} updated to ${ticketForm.status}`);
      }

      setSelectedTicket(null);
      fetchAllAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update ticket');
    }
  };

  // ─── IoT Bin Actions ───────────────────────────────────────────────
  const handleCreateBin = async (e) => {
    e.preventDefault();
    try {
      await binAPI.createBin({
        binId: binForm.binId,
        locationName: binForm.locationName,
        area: binForm.area,
        type: binForm.type,
        fillLevel: Number(binForm.fillLevel),
        coordinates: { lat: Number(binForm.lat), lng: Number(binForm.lng) },
      });
      setShowBinModal(false);
      setBinForm({ binId: '', locationName: '', area: 'Central Zone', type: 'recyclable', fillLevel: 0, lat: 12.9716, lng: 77.5946 });
      showFeedback('✅ New Smart Bin created successfully!');
      fetchAllAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create bin');
    }
  };

  const handleResetBinFill = async (binDbId) => {
    try {
      await binAPI.updateBin(binDbId, { resetFill: true });
      showFeedback('🔄 Bin emptied! Fill level reset to 0%');
      fetchAllAdminData();
    } catch (err) {
      alert('Failed to reset bin fill');
    }
  };

  const handleDeleteBin = async (binDbId) => {
    if (!window.confirm('Delete this smart bin?')) return;
    try {
      await binAPI.deleteBin(binDbId);
      showFeedback('🗑️ Bin deleted');
      fetchAllAdminData();
    } catch (err) {
      alert('Failed to delete bin');
    }
  };

  const handleSimulateIoT = async () => {
    try {
      await binAPI.simulateBinData();
      showFeedback('⚡ Simulated IoT telemetry updates across all Bengaluru bins!');
      fetchAllAdminData();
    } catch (err) {
      alert('Simulation failed.');
    }
  };

  // ─── Center Actions ────────────────────────────────────────────────
  const handleCreateCenter = async (e) => {
    e.preventDefault();
    try {
      const wasteList = centerForm.wasteAccepted.split(',').map((s) => s.trim()).filter(Boolean);
      await centerAPI.createCenter({
        name: centerForm.name,
        type: centerForm.type,
        address: centerForm.address,
        wasteAccepted: wasteList,
        phone: centerForm.phone,
        distanceKm: Number(centerForm.distanceKm),
        coordinates: { lat: Number(centerForm.lat), lng: Number(centerForm.lng) },
      });
      setShowCenterModal(false);
      setCenterForm({ name: '', type: 'recycling', address: '', wasteAccepted: 'Plastic, Paper, Metal', phone: '+91 80 2297 5555', distanceKm: 1.5, lat: 12.9341, lng: 77.6152 });
      showFeedback('✅ Recycling center added to directory!');
      fetchAllAdminData();
    } catch (err) {
      alert('Failed to create center');
    }
  };

  const handleDeleteCenter = async (id) => {
    if (!window.confirm('Delete this recycling center from directory?')) return;
    try {
      await centerAPI.deleteCenter(id);
      showFeedback('🗑️ Recycling center deleted');
      fetchAllAdminData();
    } catch (err) {
      alert('Failed to delete center');
    }
  };

  // ─── User Role & Points Actions ────────────────────────────────────
  const handleToggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'citizen' : 'admin';
    if (!window.confirm(`Change user role to ${newRole}?`)) return;
    try {
      await authAPI.updateUserRole(userId, newRole);
      showFeedback(`👥 User role updated to ${newRole}`);
      fetchAllAdminData();
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  const handleAwardBonusPoints = async (userId) => {
    try {
      await authAPI.adjustPoints(userId, 25);
      showFeedback('🎁 Awarded +25 bonus Eco Points to user!');
      fetchAllAdminData();
    } catch (err) {
      alert('Failed to adjust points');
    }
  };

  // ─── Voucher Catalog Actions ───────────────────────────────────────
  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    try {
      await rewardAPI.createVoucher(voucherForm);
      setShowVoucherModal(false);
      setVoucherForm({ title: '', description: '', pointsCost: 100, category: 'eco-product', icon: '🎟️', discountValue: '₹100 Voucher', terms: 'Valid across Bengaluru.' });
      showFeedback('✅ New reward voucher created!');
      fetchAllAdminData();
    } catch (err) {
      alert('Failed to create voucher');
    }
  };

  const handleToggleVoucher = async (id) => {
    try {
      await rewardAPI.toggleVoucher(id);
      showFeedback('🎟️ Voucher status toggled');
      fetchAllAdminData();
    } catch (err) {
      alert('Failed to toggle voucher');
    }
  };

  // ─── CSV Export Handlers ───────────────────────────────────────────
  const exportBinsCSV = () => {
    const headers = ['Bin ID,Location,Area,Type,Fill Level (%),Temperature (C),Battery (%),Status,Latitude,Longitude\n'];
    const rows = bins.map(b => `"${b.binId}","${b.locationName}","${b.area}","${b.type}",${b.fillLevel},${b.temperature},${b.batteryLevel},"${b.status}",${b.coordinates?.lat || ''},${b.coordinates?.lng || ''}`);
    const blob = new Blob([headers + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BBMP_Bins_Telemetry_Audit_${Date.now()}.csv`;
    a.click();
  };

  const exportComplaintsCSV = () => {
    const headers = ['Ticket ID,Category,Citizen Name,Location,Priority,Status,Assigned Officer,Resolution Note,Created At\n'];
    const rows = complaints.map(c => `"${c.ticketId}","${c.category}","${c.userId?.name || 'Citizen'}","${c.location}","${c.priority}","${c.status}","${c.assignedOfficer || ''}","${c.resolutionNote || ''}","${new Date(c.createdAt).toLocaleDateString()}"`);
    const blob = new Blob([headers + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BBMP_Civic_Complaints_Audit_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="container animate-fade-in">
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Municipal Command & Control Console 🏛️</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            BBMP Bengaluru Admin Management for IoT Bins, Recycling Centers, Tickets, Users, & Vouchers.
          </p>
        </div>

        <button onClick={handleSimulateIoT} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          ⚡ Trigger IoT Simulation
        </button>
      </div>

      {/* FEEDBACK ALERT */}
      {msg && (
        <div style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '10px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem' }}>
          {msg}
        </div>
      )}

      {/* TAB NAVIGATION BAR */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
        {[
          { id: 'overview', label: '📊 City Overview' },
          { id: 'bins', label: `📡 Smart Bins (${bins.length})` },
          { id: 'centers', label: `📍 Directory (${centers.length})` },
          { id: 'complaints', label: `📋 Complaints (${complaints.length})` },
          { id: 'users', label: `👥 Citizens (${users.length})` },
          { id: 'vouchers', label: `🎟️ Vouchers (${vouchers.length})` },
          { id: 'export', label: '📥 CSV Audit Exports' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid-cols-4" style={{ marginBottom: '28px' }}>
            <div className="glass-card">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Citizens</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>{overview?.totalUsers || users.length}</div>
            </div>
            <div className="glass-card">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Smart Bins</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-teal)', marginTop: '4px' }}>
                {bins.length}
              </div>
            </div>
            <div className="glass-card">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Overflowing Bins (90%+ Full)</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)', marginTop: '4px' }}>
                {bins.filter((b) => b.fillLevel >= 90).length}
              </div>
            </div>
            <div className="glass-card">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending Complaints</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '4px' }}>
                {complaints.filter((c) => c.status !== 'resolved').length}
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3>🚨 Critical Bin Overflow Alerts</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Bins requiring immediate municipal pickup</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {bins.filter((b) => b.fillLevel >= 85).map((b) => (
                <div key={b.binId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>{b.binId} — {b.locationName}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#991b1b' }}>Area: {b.area} • Temp: {b.temperature}°C</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: 800, color: '#dc2626', fontSize: '1.1rem' }}>{b.fillLevel}% Full</span>
                    <button onClick={() => handleResetBinFill(b._id)} className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                      🔄 Empty Bin
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SMART BINS MANAGEMENT */}
      {activeTab === 'bins' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Smart IoT Bins Control Panel</h2>
            <button onClick={() => setShowBinModal(true)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              ➕ Add New Smart Bin
            </button>
          </div>

          <div className="glass-card">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px' }}>Bin ID</th>
                    <th style={{ padding: '10px' }}>Location</th>
                    <th style={{ padding: '10px' }}>Area / Ward</th>
                    <th style={{ padding: '10px' }}>Type</th>
                    <th style={{ padding: '10px' }}>Fill Level</th>
                    <th style={{ padding: '10px' }}>Status</th>
                    <th style={{ padding: '10px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bins.map((b) => (
                    <tr key={b._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px', fontWeight: 700 }}>{b.binId}</td>
                      <td style={{ padding: '10px' }}>{b.locationName}</td>
                      <td style={{ padding: '10px' }}>{b.area}</td>
                      <td style={{ padding: '10px', textTransform: 'capitalize' }}>{b.type}</td>
                      <td style={{ padding: '10px', fontWeight: 700, color: b.fillLevel >= 90 ? 'var(--danger)' : b.fillLevel >= 70 ? 'var(--accent-gold)' : 'var(--success)' }}>
                        {b.fillLevel}%
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span className={`badge ${b.fillLevel >= 90 ? 'badge-danger' : b.fillLevel >= 70 ? 'badge-warning' : 'badge-success'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px', display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleResetBinFill(b._id)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                          🔄 Empty
                        </button>
                        <button onClick={() => handleDeleteBin(b._id)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#dc2626' }}>
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RECYCLING CENTERS DIRECTORY ADMIN */}
      {activeTab === 'centers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Recycling Centers & DWCC Directory Admin</h2>
            <button onClick={() => setShowCenterModal(true)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              ➕ Add Recycling Center
            </button>
          </div>

          <div className="glass-card">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px' }}>Name</th>
                    <th style={{ padding: '10px' }}>Type</th>
                    <th style={{ padding: '10px' }}>Address</th>
                    <th style={{ padding: '10px' }}>Accepted Waste</th>
                    <th style={{ padding: '10px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {centers.map((c) => (
                    <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px', fontWeight: 700 }}>{c.name}</td>
                      <td style={{ padding: '10px' }}><span className="badge badge-info">{c.type}</span></td>
                      <td style={{ padding: '10px' }}>{c.address}</td>
                      <td style={{ padding: '10px' }}>{c.wasteAccepted?.join(', ')}</td>
                      <td style={{ padding: '10px' }}>
                        <button onClick={() => handleDeleteCenter(c._id)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#dc2626' }}>
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPLAINTS TRIAGE & RESOLUTION */}
      {activeTab === 'complaints' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem' }}>📋 Civic Complaints & Ticket Resolution Command</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Inspect citizen reported issues, assign field officers, and resolve complaints.</p>
            </div>
          </div>

          <div style={{ overflowX: 'auto', marginTop: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>Ticket ID</th>
                  <th style={{ padding: '10px' }}>Category & Problem Description</th>
                  <th style={{ padding: '10px' }}>Citizen Reporter</th>
                  <th style={{ padding: '10px' }}>Location</th>
                  <th style={{ padding: '10px' }}>Priority</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontWeight: 800, color: 'var(--primary-teal)' }}>{c.ticketId}</td>
                    <td style={{ padding: '10px', maxWidth: '280px' }}>
                      <strong style={{ textTransform: 'capitalize', display: 'block', fontSize: '0.85rem' }}>{c.category?.replace('-', ' ')}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {c.description}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: 600 }}>{c.userId?.name || 'Citizen'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.userId?.email}</div>
                    </td>
                    <td style={{ padding: '10px', fontSize: '0.8rem' }}>📍 {c.location}</td>
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
                      <button
                        onClick={() => handleOpenTicketModal(c)}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '6px' }}
                      >
                        🔍 Inspect & Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CITIZEN USER & ROLE MANAGER */}
      {activeTab === 'users' && (
        <div className="glass-card">
          <h2>👥 Citizen User & Role Manager</h2>
          <div style={{ overflowX: 'auto', marginTop: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>Name</th>
                  <th style={{ padding: '10px' }}>Email</th>
                  <th style={{ padding: '10px' }}>Role</th>
                  <th style={{ padding: '10px' }}>Eco Points</th>
                  <th style={{ padding: '10px' }}>Level</th>
                  <th style={{ padding: '10px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontWeight: 700 }}>{u.name}</td>
                    <td style={{ padding: '10px' }}>{u.email}</td>
                    <td style={{ padding: '10px' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '10px', fontWeight: 700, color: 'var(--primary-teal)' }}>{u.points} pts</td>
                    <td style={{ padding: '10px' }}>{u.level}</td>
                    <td style={{ padding: '10px', display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleToggleUserRole(u._id, u.role)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                        {u.role === 'admin' ? 'Demote to Citizen' : 'Promote to Admin'}
                      </button>
                      <button onClick={() => handleAwardBonusPoints(u._id)} className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                        🎁 +25 Pts
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: REWARD VOUCHERS CATALOG */}
      {activeTab === 'vouchers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Citizen Reward Vouchers Manager</h2>
            <button onClick={() => setShowVoucherModal(true)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              ➕ Create Reward Voucher
            </button>
          </div>

          <div className="grid-cols-2">
            {vouchers.map((v) => (
              <div key={v._id} className="glass-card" style={{ opacity: v.isActive ? 1 : 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.6rem' }}>{v.icon}</span>
                  <span className="badge badge-success">{v.pointsCost} Eco Points</span>
                </div>
                <h3>{v.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{v.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                  <span className={`badge ${v.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {v.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button onClick={() => handleToggleVoucher(v._id)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                    {v.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: CSV AUDIT EXPORTS */}
      {activeTab === 'export' && (
        <div className="glass-card" style={{ maxWidth: '640px' }}>
          <h2>📥 Municipal Sustainability Audit Exports</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Generate and download official CSV data reports for BBMP ward sustainability audits.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '1rem' }}>📡 Smart Bins Telemetry Audit (CSV)</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Includes bin IDs, fill levels, temperature, battery & coordinates</span>
              </div>
              <button onClick={exportBinsCSV} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                📥 Export Bins CSV
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '1rem' }}>📋 Civic Complaints Resolution Audit (CSV)</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Includes ticket IDs, categories, locations, priority & dispatch status</span>
              </div>
              <button onClick={exportComplaintsCSV} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                📥 Export Complaints CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TICKET INSPECTION & RESOLUTION */}
      {selectedTicket && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '620px', background: 'white', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', pb: '12px' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '4px' }}>Ticket Details</span>
                <h2 style={{ fontSize: '1.4rem' }}>{selectedTicket.ticketId}</h2>
              </div>
              <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>

            {/* PROBLEM DETAILS */}
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, textTransform: 'capitalize', color: 'var(--primary-teal)' }}>
                  📌 Category: {selectedTicket.category?.replace('-', ' ')}
                </span>
                <span className={`badge ${selectedTicket.priority === 'critical' ? 'badge-danger' : selectedTicket.priority === 'high' ? 'badge-warning' : 'badge-info'}`}>
                  Priority: {selectedTicket.priority}
                </span>
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: '8px 0', lineHeight: '1.5' }}>
                <strong>Description:</strong> {selectedTicket.description}
              </div>

              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                📍 Location: <strong>{selectedTicket.location}</strong>
              </div>

              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                👤 Reported By: <strong>{selectedTicket.userId?.name || 'Citizen'}</strong> ({selectedTicket.userId?.email || 'N/A'})
              </div>
            </div>

            {/* UPLOADED PHOTO PREVIEW */}
            {selectedTicket.imageUrl && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  📸 Citizen Uploaded Photo Evidence:
                </div>
                <img
                  src={selectedTicket.imageUrl}
                  alt="Complaint Evidence"
                  style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                />
              </div>
            )}

            {/* RESOLUTION & DISPATCH FORM */}
            <form onSubmit={handleSaveTicketResolution} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  👮 Assigned Field Officer / Maintenance Crew:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Officer K. Ramesh (Vehicle KA-01-ECO-102)"
                  value={ticketForm.assignedOfficer}
                  onChange={(e) => setTicketForm({ ...ticketForm, assignedOfficer: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  📝 Resolution Remarks / Action Notes:
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Dispatched cleanup crew at 10:30 AM. Bin emptied and roadside area sanitized."
                  value={ticketForm.resolutionNote}
                  onChange={(e) => setTicketForm({ ...ticketForm, resolutionNote: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  ⚡ Update Ticket Status:
                </label>
                <select
                  value={ticketForm.status}
                  onChange={(e) => setTicketForm({ ...ticketForm, status: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  <option value="submitted">Submitted (New)</option>
                  <option value="assigned">Assigned to Field Officer</option>
                  <option value="in-progress">In-Progress (Cleanup Underway)</option>
                  <option value="resolved">✅ Resolved (Auto-Award +20 Pts to Citizen)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>
                  💾 Save & Update Ticket Status
                </button>
                <button type="button" onClick={() => setSelectedTicket(null)} className="btn btn-secondary" style={{ padding: '12px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SMART BIN */}
      {showBinModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', background: 'white' }}>
            <h3>➕ Register New Smart Bin</h3>
            <form onSubmit={handleCreateBin} style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Bin ID (e.g. BIN-BLR-008)" value={binForm.binId} onChange={(e) => setBinForm({ ...binForm, binId: e.target.value })} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Location Name (e.g. Jayanagar 4th Block)" value={binForm.locationName} onChange={(e) => setBinForm({ ...binForm, locationName: e.target.value })} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Area / Ward (e.g. South Zone)" value={binForm.area} onChange={(e) => setBinForm({ ...binForm, area: e.target.value })} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <select value={binForm.type} onChange={(e) => setBinForm({ ...binForm, type: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <option value="recyclable">Recyclable (Blue)</option>
                <option value="organic">Organic (Green)</option>
                <option value="e-waste">E-Waste (Red)</option>
                <option value="hazardous">Hazardous (Red)</option>
                <option value="general">General (Black)</option>
              </select>
              <input type="number" placeholder="Initial Fill Level (%)" value={binForm.fillLevel} onChange={(e) => setBinForm({ ...binForm, fillLevel: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="number" step="any" placeholder="Latitude (12.9716)" value={binForm.lat} onChange={(e) => setBinForm({ ...binForm, lat: e.target.value })} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                <input type="number" step="any" placeholder="Longitude (77.5946)" value={binForm.lng} onChange={(e) => setBinForm({ ...binForm, lng: e.target.value })} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Bin</button>
                <button type="button" onClick={() => setShowBinModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD RECYCLING CENTER */}
      {showCenterModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', background: 'white' }}>
            <h3>➕ Register Recycling Center / DWCC</h3>
            <form onSubmit={handleCreateCenter} style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Center Name (e.g. Jayanagar DWCC)" value={centerForm.name} onChange={(e) => setCenterForm({ ...centerForm, name: e.target.value })} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <select value={centerForm.type} onChange={(e) => setCenterForm({ ...centerForm, type: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <option value="recycling">Recycling Center</option>
                <option value="dry-waste">Dry Waste Collection Center (DWCC)</option>
                <option value="e-waste">E-Waste Hub</option>
                <option value="composting">Compost Yard</option>
                <option value="hazardous">Hazardous Depot</option>
              </select>
              <input type="text" placeholder="Full Address" value={centerForm.address} onChange={(e) => setCenterForm({ ...centerForm, address: e.target.value })} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Accepted Waste (comma separated)" value={centerForm.wasteAccepted} onChange={(e) => setCenterForm({ ...centerForm, wasteAccepted: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Phone Number" value={centerForm.phone} onChange={(e) => setCenterForm({ ...centerForm, phone: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="number" step="any" placeholder="Latitude" value={centerForm.lat} onChange={(e) => setCenterForm({ ...centerForm, lat: e.target.value })} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                <input type="number" step="any" placeholder="Longitude" value={centerForm.lng} onChange={(e) => setCenterForm({ ...centerForm, lng: e.target.value })} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Center</button>
                <button type="button" onClick={() => setShowCenterModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE REWARD VOUCHER */}
      {showVoucherModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', background: 'white' }}>
            <h3>➕ Create Citizen Reward Voucher</h3>
            <form onSubmit={handleCreateVoucher} style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Voucher Title (e.g. BMTC 25% Pass)" value={voucherForm.title} onChange={(e) => setVoucherForm({ ...voucherForm, title: e.target.value })} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Description" value={voucherForm.description} onChange={(e) => setVoucherForm({ ...voucherForm, description: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="number" placeholder="Points Cost (e.g. 100)" value={voucherForm.pointsCost} onChange={(e) => setVoucherForm({ ...voucherForm, pointsCost: e.target.value })} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Discount Value (e.g. 25% OFF)" value={voucherForm.discountValue} onChange={(e) => setVoucherForm({ ...voucherForm, discountValue: e.target.value })} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <select value={voucherForm.category} onChange={(e) => setVoucherForm({ ...voucherForm, category: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <option value="transit">Public Transit</option>
                <option value="shopping">Shopping & Grocery</option>
                <option value="eco-product">Eco Products</option>
                <option value="utility">Utility Bill Rebate</option>
              </select>
              <input type="text" placeholder="Icon Emoji (e.g. 🚌)" value={voucherForm.icon} onChange={(e) => setVoucherForm({ ...voucherForm, icon: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Voucher</button>
                <button type="button" onClick={() => setShowVoucherModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
