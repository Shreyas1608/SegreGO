const mongoose = require('mongoose');

const recyclingCenterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['recycling', 'e-waste', 'hazardous', 'composting', 'dry-waste', 'municipal'], required: true },
    address: { type: String, required: true },
    wasteAccepted: [{ type: String }],
    openingHours: { type: String, default: 'Mon-Sat: 9:00 AM - 6:00 PM' },
    phone: { type: String, default: 'Contact local authority' },
    coordinates: { lat: { type: Number, default: 12.9716 }, lng: { type: Number, default: 77.5946 } },
    distanceKm: { type: Number, default: 1.5 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecyclingCenter', recyclingCenterSchema);
