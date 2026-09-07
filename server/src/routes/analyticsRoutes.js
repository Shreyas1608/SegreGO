const express = require('express');
const { getUserImpact, getAdminOverview, getCityStats } = require('../controllers/analyticsController');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();
router.get('/impact', protect, getUserImpact);
router.get('/overview', protect, adminOnly, getAdminOverview);
router.get('/city', protect, getCityStats);
module.exports = router;
