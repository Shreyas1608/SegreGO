const express = require('express');
const { getMyTransactions, getLeaderboard } = require('../controllers/rewardController');
const { protect } = require('../middleware/auth');
const router = express.Router();
router.get('/transactions', protect, getMyTransactions);
router.get('/leaderboard', protect, getLeaderboard);
module.exports = router;
