const RecyclingCenter = require('../models/RecyclingCenter');

exports.getAllCenters = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const centers = await RecyclingCenter.find(filter).sort({ distanceKm: 1 });
    res.json(centers);
  } catch (err) { next(err); }
};

exports.getCenterById = async (req, res, next) => {
  try {
    const center = await RecyclingCenter.findById(req.params.id);
    if (!center) return res.status(404).json({ message: 'Center not found' });
    res.json(center);
  } catch (err) { next(err); }
};

exports.createCenter = async (req, res, next) => {
  try {
    const center = await RecyclingCenter.create(req.body);
    res.status(201).json(center);
  } catch (err) { next(err); }
};
