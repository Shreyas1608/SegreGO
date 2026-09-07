const mongoose = require('mongoose');

const binSchema = new mongoose.Schema(
  {
    binId: { type: String, required: true, unique: true },
    locationName: { type: String, required: true },
    area: { type: String, default: 'Central Zone' },
    type: { type: String, enum: ['recyclable', 'organic', 'hazardous', 'general', 'e-waste'], required: true },
    fillLevel: { type: Number, default: 0, min: 0, max: 100 },
    temperature: { type: Number, default: 28 },
    batteryLevel: { type: Number, default: 100, min: 0, max: 100 },
    status: { type: String, enum: ['available', 'almost-full', 'full', 'maintenance', 'offline'], default: 'available' },
    coordinates: { lat: { type: Number, default: 12.9716 }, lng: { type: Number, default: 77.5946 } },
    deviceId: { type: String },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bin', binSchema);
