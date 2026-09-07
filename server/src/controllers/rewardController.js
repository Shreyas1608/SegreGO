const RewardTransaction = require('../models/RewardTransaction');
const User = require('../models/User');

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
