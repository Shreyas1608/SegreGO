const express = require('express');
const { getAllBins, createBin, updateBinStatus } = require('../controllers/binController');
const router = express.Router();

router.get('/', getAllBins);
router.post('/', createBin);
router.put('/:id', updateBinStatus);

module.exports = router;
