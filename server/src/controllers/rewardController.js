const RewardTransaction = require('../models/RewardTransaction');
const User = require('../models/User');
const Voucher = require('../models/Voucher');
const Notification = require('../models/Notification');

exports.getMyTransactions = async (req, res, next) => {
  try {
    const txns = await RewardTransaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const totalEarned = txns.filter(t => t.points > 0).reduce((s, t) => s + t.points, 0);
    const totalSpent = txns.filter(t => t.points < 0).reduce((s, t) => s + Math.abs(t.points), 0);
    res.json({ transactions: txns, totalEarned, totalSpent, currentBalance: req.user.points });
  } catch (err) { next(err); }
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'citizen' }).sort({ points: -1 }).limit(20).select('name points level scansCount');
    const board = users.map((u, i) => ({
      rank: i + 1,
      name: u.name.split(' ')[0] + (u.name.split(' ')[1] ? ` ${u.name.split(' ')[1][0]}.` : ''),
      points: u.points, level: u.level, scansCount: u.scansCount,
    }));
    res.json(board);
  } catch (err) { next(err); }
};

exports.getVouchers = async (req, res, next) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { isActive: true };
    const vouchers = await Voucher.find(filter).sort({ pointsCost: 1 });
    res.json(vouchers);
  } catch (err) { next(err); }
};

exports.createVoucher = async (req, res, next) => {
  try {
    const { title, description, pointsCost, category, icon, discountValue, terms } = req.body;
    if (!title || !pointsCost || !discountValue) {
      return res.status(400).json({ message: 'title, pointsCost, and discountValue are required' });
    }

    const voucher = await Voucher.create({
      title,
      description: description || 'Eco reward discount coupon.',
      pointsCost: Number(pointsCost),
      category: category || 'eco-product',
      icon: icon || '🎟️',
      discountValue,
      terms: terms || 'Valid at participating Bengaluru partners.',
    });

    res.status(201).json(voucher);
  } catch (err) { next(err); }
};

exports.toggleVoucherStatus = async (req, res, next) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) return res.status(404).json({ message: 'Voucher not found' });
    voucher.isActive = !voucher.isActive;
    await voucher.save();
    res.json({ message: `Voucher status set to ${voucher.isActive ? 'Active' : 'Inactive'}`, voucher });
  } catch (err) { next(err); }
};

exports.redeemVoucher = async (req, res, next) => {
  try {
    const { voucherId } = req.body;
    if (!voucherId) return res.status(400).json({ message: 'voucherId is required' });

    const voucher = await Voucher.findById(voucherId);
    if (!voucher || !voucher.isActive) return res.status(404).json({ message: 'Voucher unavailable' });

    const user = await User.findById(req.user._id);
    if (user.points < voucher.pointsCost) {
      return res.status(400).json({ message: `Insufficient points. You need ${voucher.pointsCost} pts (Balance: ${user.points} pts)` });
    }

    user.points -= voucher.pointsCost;
    await user.save();

    const randomHex = Math.floor(100000 + Math.random() * 900000);
    const couponCode = `ECO-BLR-${randomHex}`;

    const txn = await RewardTransaction.create({
      userId: user._id,
      action: 'Voucher Redemption',
      points: -voucher.pointsCost,
      reason: `Redeemed: ${voucher.title} (Code: ${couponCode})`,
      verificationStatus: 'verified',
    });

    await Notification.create({
      userId: user._id,
      title: '🎟️ Voucher Redeemed!',
      message: `You redeemed ${voucher.title}! Your code: ${couponCode}`,
      type: 'reward',
    });

    res.json({
      message: 'Voucher redeemed successfully!',
      couponCode,
      voucher,
      remainingPoints: user.points,
      transactionId: txn._id,
    });
  } catch (err) { next(err); }
};
