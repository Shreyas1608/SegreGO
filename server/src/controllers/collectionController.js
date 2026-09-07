const Collection = require('../models/Collection');

exports.getCollections = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role !== 'admin') filter.area = req.user.location?.area || 'Central Zone';
    const collections = await Collection.find(filter).sort({ scheduleDate: 1 });
    res.json(collections);
  } catch (err) { next(err); }
};

exports.getUpcoming = async (req, res, next) => {
  try {
    const now = new Date();
    const upcoming = await Collection.findOne({ scheduleDate: { $gte: now }, status: { $ne: 'completed' } }).sort({ scheduleDate: 1 });
    res.json(upcoming || null);
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const collection = await Collection.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    res.json(collection);
  } catch (err) { next(err); }
};
