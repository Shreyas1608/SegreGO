const express = require('express');
const { getAllCenters, getCenterById, createCenter } = require('../controllers/centerController');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();
router.get('/', getAllCenters);
router.get('/:id', getCenterById);
router.post('/', protect, adminOnly, createCenter);
module.exports = router;
