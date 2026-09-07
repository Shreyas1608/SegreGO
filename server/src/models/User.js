const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['citizen', 'collector', 'admin'], default: 'citizen' },
    points: { type: Number, default: 0 },
    scansCount: { type: Number, default: 0 },
    correctSegregationPercent: { type: Number, default: 100 },
    co2SavedKg: { type: Number, default: 0 },
    streakDays: { type: Number, default: 1 },
    lastActiveDate: { type: Date, default: Date.now },
    level: {
      type: String,
      enum: ['🌱 Eco Starter', '🌿 Green Citizen', '♻️ Recycling Champion', '🌎 Eco Warrior', '🏆 Sustainability Leader'],
      default: '🌱 Eco Starter',
    },
    location: {
      city: { type: String, default: 'Eco City' },
      area: { type: String, default: 'Central Zone' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
