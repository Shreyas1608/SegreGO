const express = require('express');
const {
  getAllBinStatuses,
  getBinById,
  createBin,
  updateBin,
  deleteBin,
  updateBinFromDevice,
  simulateBinData,
} = require('../controllers/iotController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/bins', getAllBinStatuses);
router.get('/bins/:id', getBinById);
router.post('/bins', protect, adminOnly, createBin);
router.put('/bins/:id', protect, adminOnly, updateBin);
router.delete('/bins/:id', protect, adminOnly, deleteBin);

router.post('/sensor-data', updateBinFromDevice);
router.post('/simulate', protect, adminOnly, simulateBinData);

module.exports = router;
