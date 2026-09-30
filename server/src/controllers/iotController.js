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

exports.createBin = async (req, res, next) => {
  try {
    const { binId, locationName, area, type, fillLevel, temperature, batteryLevel, deviceId, coordinates } = req.body;
    if (!binId || !locationName) return res.status(400).json({ message: 'binId and locationName are required' });

    const existing = await Bin.findOne({ binId });
    if (existing) return res.status(400).json({ message: `Bin with ID ${binId} already exists` });

    const level = fillLevel || 0;
    const bin = await Bin.create({
      binId,
      locationName,
      area: area || 'Central Zone',
      type: type || 'recyclable',
      fillLevel: level,
      temperature: temperature || 28,
      batteryLevel: batteryLevel || 100,
      status: getStatusFromFill(level),
      deviceId: deviceId || `ESP32-${Math.floor(100 + Math.random() * 900)}`,
      coordinates: coordinates || { lat: 12.9716, lng: 77.5946 },
    });

    res.status(201).json(bin);
  } catch (err) { next(err); }
};

exports.updateBin = async (req, res, next) => {
  try {
    const { fillLevel, locationName, area, type, temperature, batteryLevel, resetFill } = req.body;
    const bin = await Bin.findById(req.params.id);
    if (!bin) return res.status(404).json({ message: 'Bin not found' });

    if (resetFill) {
      bin.fillLevel = 0;
    } else if (fillLevel !== undefined) {
      bin.fillLevel = fillLevel;
    }

    if (locationName) bin.locationName = locationName;
    if (area) bin.area = area;
    if (type) bin.type = type;
    if (temperature !== undefined) bin.temperature = temperature;
    if (batteryLevel !== undefined) bin.batteryLevel = batteryLevel;

    bin.status = getStatusFromFill(bin.fillLevel);
    bin.lastUpdated = new Date();
    await bin.save();

    res.json(bin);
  } catch (err) { next(err); }
};

exports.deleteBin = async (req, res, next) => {
  try {
    const bin = await Bin.findByIdAndDelete(req.params.id);
    if (!bin) return res.status(404).json({ message: 'Bin not found' });
    res.json({ message: 'Bin deleted successfully', binId: bin.binId });
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
