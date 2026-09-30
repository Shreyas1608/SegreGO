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
    const { name, type, address, wasteAccepted, openingHours, phone, distanceKm, coordinates } = req.body;
    if (!name || !address) return res.status(400).json({ message: 'name and address are required' });

    const center = await RecyclingCenter.create({
      name,
      type: type || 'recycling',
      address,
      wasteAccepted: wasteAccepted || ['Plastic', 'Paper', 'Metal'],
      openingHours: openingHours || 'Mon-Sat: 9:00 AM - 5:00 PM',
      phone: phone || '+91 80 2297 5555',
      distanceKm: distanceKm || 2.5,
      coordinates: coordinates || { lat: 12.9716, lng: 77.5946 },
    });

    res.status(201).json(center);
  } catch (err) { next(err); }
};

exports.updateCenter = async (req, res, next) => {
  try {
    const center = await RecyclingCenter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!center) return res.status(404).json({ message: 'Center not found' });
    res.json(center);
  } catch (err) { next(err); }
};

exports.deleteCenter = async (req, res, next) => {
  try {
    const center = await RecyclingCenter.findByIdAndDelete(req.params.id);
    if (!center) return res.status(404).json({ message: 'Center not found' });
    res.json({ message: 'Recycling center deleted successfully', id: center._id });
  } catch (err) { next(err); }
};
