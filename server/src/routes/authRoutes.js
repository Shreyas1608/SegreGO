const express = require('express');
const { register, login, getMe, switchRole, getAllUsers, updateUserRole, adjustUserPoints } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/switch-role', protect, switchRole);

router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/role', protect, adminOnly, updateUserRole);
router.put('/users/:id/points', protect, adminOnly, adjustUserPoints);

module.exports = router;
