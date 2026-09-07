const express = require('express');
const { getAllBinStatuses, getBinById, updateBinFromDevice, simulateBinData } = require('../controllers/iotController');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();
router.get('/bins', getAllBinStatuses);
router.get('/bins/:id', getBinById);
router.post('/sensor-data', updateBinFromDevice);
router.post('/simulate', protect, adminOnly, simulateBinData);
module.exports = router;
