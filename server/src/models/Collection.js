const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['dry-waste', 'wet-waste', 'hazardous', 'e-waste', 'recyclable'], required: true },
    scheduleDate: { type: Date, required: true },
    scheduleTime: { type: String, default: '8:00 AM - 10:00 AM' },
    area: { type: String, required: true },
    collectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['scheduled', 'assigned', 'on-the-way', 'collected', 'completed'], default: 'scheduled' },
    vehicleNumber: { type: String, default: 'ECO-VH-001' },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Collection', collectionSchema);
