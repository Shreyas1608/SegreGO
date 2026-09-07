const express = require('express');
const { getMyNotifications, markAsRead, markAllRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const router = express.Router();
router.get('/', protect, getMyNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllRead);
module.exports = router;
