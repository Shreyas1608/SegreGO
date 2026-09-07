const Bin = require('../models/Bin');

exports.getAllBins = async (req, res, next) => {
  try {
    const bins = await Bin.find();
    res.json(bins);
  } catch (err) {
    next(err);
  }
};

exports.createBin = async (req, res, next) => {
  try {
    const { locationName, type, coordinates } = req.body;
    const bin = await Bin.create({ locationName, type, coordinates });
    res.status(201).json(bin);
  } catch (err) {
    next(err);
  }
};

exports.updateBinStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fillLevel, status } = req.body;
    const bin = await Bin.findByIdAndUpdate(id, { fillLevel, status }, { new: true });
    if (!bin) return res.status(404).json({ message: 'Bin not found' });
    const io = req.app.get('io');
    if (io) io.emit('binUpdated', bin);
    res.json(bin);
  } catch (err) {
    next(err);
  }
};
