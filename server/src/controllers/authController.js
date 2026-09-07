const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const getLevel = (points) => {
  if (points >= 1500) return '🏆 Sustainability Leader';
  if (points >= 700) return '🌎 Eco Warrior';
  if (points >= 300) return '♻️ Recycling Champion';
  if (points >= 100) return '🌿 Green Citizen';
  return '🌱 Eco Starter';
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists with this email' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, points: user.points, level: user.level, streakDays: user.streakDays },
    });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    // Update streak
    const now = new Date();
    const last = new Date(user.lastActiveDate);
    const daysDiff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) user.streakDays += 1;
    else if (daysDiff > 1) user.streakDays = 1;
    user.lastActiveDate = now;
    user.level = getLevel(user.points);
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, points: user.points, level: user.level, streakDays: user.streakDays, scansCount: user.scansCount, co2SavedKg: user.co2SavedKg, correctSegregationPercent: user.correctSegregationPercent },
    });
  } catch (err) { next(err); }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
};
