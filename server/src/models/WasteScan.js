const mongoose = require('mongoose');

const wasteScanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageHash: { type: String, required: true },
    category: {
      type: String,
      enum: ['Biodegradable', 'Paper', 'Plastic', 'Metal', 'Glass', 'E-Waste', 'Hazardous', 'Medical', 'Textile', 'Non-Recyclable', 'Other'],
      required: true,
    },
    material: { type: String },
    confidence: { type: Number, min: 0, max: 1 },
    recommendedBin: { type: String },
    disposalInstructions: { type: String },
    environmentalImpact: { type: String },
    pointsAwarded: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WasteScan', wasteScanSchema);
