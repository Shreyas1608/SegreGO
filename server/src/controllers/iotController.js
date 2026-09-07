const Bin = require('../models/Bin');

const getStatusFromFill = (level) => {
  if (level >= 90) return 'full';
  if (level >= 70) return 'almost-full';
  return 'available';
};

exports.getAllBinStatuses = async (req, res, next) => {
  try {
    const bins = await Bin.find().sort({ fillLevel: -1 });
    res.json(bins);
  } catch (err) { next(err); }
};

exports.getBinById = async (req, res, next) => {
  try {
    const bin = await Bin.findOne({ binId: req.params.id });
    if (!bin) return res.status(404).json({ message: 'Bin not found' });
    res.json(bin);
  } catch (err) { next(err); }
};

exports.updateBinFromDevice = async (req, res, next) => {
  try {
    const { deviceId, fillLevel, temperature, batteryLevel } = req.body;
    const bin = await Bin.findOne({ deviceId });
    if (!bin) return res.status(404).json({ message: 'Device not registered' });
    bin.fillLevel = fillLevel ?? bin.fillLevel;
    bin.temperature = temperature ?? bin.temperature;
    bin.batteryLevel = batteryLevel ?? bin.batteryLevel;
    bin.status = getStatusFromFill(bin.fillLevel);
    bin.lastUpdated = new Date();
    await bin.save();
    res.json(bin);
  } catch (err) { next(err); }
};

exports.simulateBinData = async (req, res, next) => {
  try {
    const bins = await Bin.find();
    for (const bin of bins) {
      const delta = Math.floor(Math.random() * 21) - 5;
      bin.fillLevel = Math.max(0, Math.min(100, bin.fillLevel + delta));
      bin.temperature = 25 + Math.floor(Math.random() * 15);
      bin.batteryLevel = Math.max(10, bin.batteryLevel - Math.floor(Math.random() * 3));
      bin.status = getStatusFromFill(bin.fillLevel);
      bin.lastUpdated = new Date();
      await bin.save();
    }
    res.json({ message: 'IoT simulation complete', binsUpdated: bins.length });
  } catch (err) { next(err); }
};
