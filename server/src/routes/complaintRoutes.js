const express = require('express');
const { createComplaint, getMyComplaints, getAllComplaints, updateComplaintStatus } = require('../controllers/complaintController');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();
router.post('/', protect, createComplaint);
router.get('/mine', protect, getMyComplaints);
router.get('/', protect, adminOnly, getAllComplaints);
router.put('/:id/status', protect, adminOnly, updateComplaintStatus);
module.exports = router;
