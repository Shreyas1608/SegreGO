const express = require('express');
const {
  getMyTransactions,
  getLeaderboard,
  getVouchers,
  createVoucher,
  toggleVoucherStatus,
  redeemVoucher,
} = require('../controllers/rewardController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/transactions', protect, getMyTransactions);
router.get('/leaderboard', protect, getLeaderboard);
router.get('/vouchers', protect, getVouchers);
router.post('/vouchers', protect, adminOnly, createVoucher);
router.put('/vouchers/:id/toggle', protect, adminOnly, toggleVoucherStatus);
router.post('/vouchers/redeem', protect, redeemVoucher);

module.exports = router;
