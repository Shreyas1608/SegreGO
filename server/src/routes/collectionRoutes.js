const express = require('express');
const { getCollections, getUpcoming, updateStatus } = require('../controllers/collectionController');
const { protect } = require('../middleware/auth');
const router = express.Router();
router.get('/', protect, getCollections);
router.get('/upcoming', protect, getUpcoming);
router.put('/:id/status', protect, updateStatus);
module.exports = router;
