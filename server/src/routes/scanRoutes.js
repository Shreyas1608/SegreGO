const express = require('express');
const { classifyWaste, getMyScans, getScanHistory } = require('../controllers/scanController');
const { protect } = require('../middleware/auth');
const router = express.Router();
router.post('/classify', protect, classifyWaste);
router.get('/mine', protect, getMyScans);
router.get('/history', protect, getScanHistory);
module.exports = router;
