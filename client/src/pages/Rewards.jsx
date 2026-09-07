import React, { useEffect, useState } from 'react';
import { rewardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Rewards() {
  const { user } = useAuth();
  const [ledger, setLedger] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    rewardAPI.getTransactions()
      .then((res) => setLedger(res.data))
      .catch(() => {});

    rewardAPI.getLeaderboard()
      .then((res) => setLeaderboard(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="container animate-fade-in">
      {/* HEADER CARD */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, #0f172a, #0f766e)', color: 'white', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-success" style={{ marginBottom: '8px' }}>{user?.level}</span>
            <h1 style={{ color: 'white', fontSize: '2.2rem' }}>{user?.points || 0} <span style={{ fontSize: '1.2rem', color: '#2dd4bf' }}>Eco Points</span></h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '4px' }}>Earn points by scanning waste, completing quizzes, and reporting issues.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Lifetime Earned</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>+{ledger?.totalEarned || user?.points || 0} pts</div>
          </div>
        </div>
      </div>

      <div className="grid-cols-2">
        {/* LEADERBOARD */}
        <div className="glass-card">
          <h3>🏆 Community Leaderboard</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Top waste segregators in your city</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {leaderboard.map((item) => (
              <div
                key={item.rank}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', background: item.name.startsWith(user?.name?.split(' ')[0]) ? '#e0f2fe' : '#f8fafc',
                  borderRadius: '10px', border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 800, width: '24px', textAlign: 'center' }}>
                    {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.level}</div>
                  </div>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--primary-teal)' }}>{item.points} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* TRANSACTIONS LEDGER */}
        <div className="glass-card">
          <h3>📜 Reward History Ledger</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Verified anti-cheat reward transactions</p>
          {ledger?.transactions?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ledger.transactions.map((tx) => (
                <div key={tx._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{tx.action}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.reason}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: tx.points > 0 ? 'var(--success)' : 'var(--danger)' }}>
                      +{tx.points} pts
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{tx.verificationStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No transaction history available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
