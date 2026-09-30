const express = require('express');
const { getAllCenters, getCenterById, createCenter, updateCenter, deleteCenter } = require('../controllers/centerController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllCenters);
router.get('/:id', getCenterById);
router.post('/', protect, adminOnly, createCenter);
router.put('/:id', protect, adminOnly, updateCenter);
router.delete('/:id', protect, adminOnly, deleteCenter);

module.exports = router;
