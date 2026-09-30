import React, { useEffect, useState } from 'react';
import { rewardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Rewards() {
  const { user, updateUser } = useAuth();
  const [ledger, setLedger] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [redeeming, setRedeeming] = useState(null);
  const [redeemedCoupon, setRedeemedCoupon] = useState(null);
  const [error, setError] = useState('');

  const fetchRewardData = () => {
    rewardAPI.getTransactions()
      .then((res) => setLedger(res.data))
      .catch(() => {});

    rewardAPI.getLeaderboard()
      .then((res) => setLeaderboard(res.data))
      .catch(() => {});

    rewardAPI.getVouchers()
      .then((res) => setVouchers(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchRewardData();
  }, []);

  const handleRedeem = async (voucher) => {
    if ((user?.points || 0) < voucher.pointsCost) {
      setError(`You need ${voucher.pointsCost} Eco Points to redeem this voucher (Balance: ${user?.points || 0} pts).`);
      return;
    }

    setRedeeming(voucher._id);
    setError('');

    try {
      const res = await rewardAPI.redeemVoucher(voucher._id);
      setRedeemedCoupon(res.data);
      updateUser({ points: res.data.remainingPoints });
      fetchRewardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to redeem voucher.');
    } finally {
      setRedeeming(null);
    }
  };

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

      {/* ERROR ALERT */}
      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px', fontSize: '0.9rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* REDEEMED COUPON MODAL */}
      {redeemedCoupon && (
        <div className="glass-card animate-fade-in" style={{ borderLeft: '6px solid var(--primary-green)', marginBottom: '32px', background: '#f0fdf4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 800, color: 'var(--primary-green)', fontSize: '1.1rem' }}>🎉 Voucher Redeemed Successfully!</span>
            <button onClick={() => setRedeemedCoupon(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
          </div>
          <p style={{ fontSize: '0.9rem', marginBottom: '12px' }}>{redeemedCoupon.voucher?.title}</p>

          <div style={{ background: 'white', padding: '14px', borderRadius: '10px', border: '2px dashed var(--primary-green)', textAlign: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Your Unique Coupon Code</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-teal)', letterSpacing: '2px', marginTop: '4px' }}>
              {redeemedCoupon.couponCode}
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Show this code at participating Bengaluru outlets or enter in the app to claim your discount!
          </div>
        </div>
      )}

      {/* VOUCHER REDEMPTION STORE */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>🛍️ Citizen Reward Voucher Store</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
          Redeem your Eco Points for real discounts on Namma Metro, eco-products, and utility bills.
        </p>

        <div className="grid-cols-2">
          {vouchers.map((v) => {
            const canAfford = (user?.points || 0) >= v.pointsCost;
            return (
              <div key={v._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '1.8rem' }}>{v.icon}</span>
                    <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>{v.pointsCost} Eco Points</span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>{v.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.4' }}>
                    {v.description}
                  </p>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', marginBottom: '14px' }}>
                    📌 {v.terms}
                  </div>

                  <button
                    onClick={() => handleRedeem(v)}
                    disabled={!canAfford || redeeming === v._id}
                    className={`btn ${canAfford ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
                  >
                    {redeeming === v._id ? 'Redeeming...' : canAfford ? `Redeem for ${v.pointsCost} Pts` : `Need ${v.pointsCost - (user?.points || 0)} More Pts`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LEADERBOARD & LEDGER */}
      <div className="grid-cols-2">
        {/* LEADERBOARD */}
        <div className="glass-card">
          <h3>🏆 Community Leaderboard</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Top waste segregators in Bengaluru</p>
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
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Verified anti-cheat transactions</p>
          {ledger?.transactions?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
              {ledger.transactions.map((tx) => (
                <div key={tx._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{tx.action}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.reason}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: tx.points > 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {tx.points > 0 ? `+${tx.points}` : tx.points} pts
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
