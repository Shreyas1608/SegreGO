const User = require('../models/User');
const WasteScan = require('../models/WasteScan');
const Bin = require('../models/Bin');
const Complaint = require('../models/Complaint');
const Collection = require('../models/Collection');
const RewardTransaction = require('../models/RewardTransaction');

exports.getUserImpact = async (req, res, next) => {
  try {
    const user = req.user;
    const recentTxns = await RewardTransaction.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5);
    res.json({
      scansCount: user.scansCount, co2SavedKg: user.co2SavedKg,
      correctSegregationPercent: user.correctSegregationPercent,
      streakDays: user.streakDays, points: user.points, level: user.level,
      recentTransactions: recentTxns,
    });
  } catch (err) { next(err); }
};

exports.getAdminOverview = async (req, res, next) => {
  try {
    const [totalUsers, totalScans, bins, pendingComplaints, completedCollections] = await Promise.all([
      User.countDocuments(), WasteScan.countDocuments(), Bin.find(),
      Complaint.countDocuments({ status: { $ne: 'resolved' } }),
      Collection.countDocuments({ status: 'completed' }),
    ]);
    const overflowing = bins.filter(b => b.fillLevel >= 90).length;
    const avgSeg = 94; // demo value
    res.json({
      totalUsers, totalScans, totalBins: bins.length, overflowingBins: overflowing,
      pendingComplaints, completedCollections, avgSegregationRate: avgSeg,
      activeBins: bins.filter(b => b.status !== 'offline').length,
    });
  } catch (err) { next(err); }
};

exports.getCityStats = async (req, res, next) => {
  try {
    const scans = await WasteScan.find().select('category createdAt');
    const catCounts = {};
    scans.forEach(s => { catCounts[s.category] = (catCounts[s.category] || 0) + 1; });
    res.json({ wasteByCategory: catCounts, totalScans: scans.length });
  } catch (err) { next(err); }
};
