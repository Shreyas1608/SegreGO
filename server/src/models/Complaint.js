const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['garbage-overflow', 'illegal-dumping', 'missed-collection', 'open-garbage', 'damaged-bin', 'hazardous-waste', 'burning-waste', 'cleanliness', 'other'],
      required: true,
    },
    description: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    status: { type: String, enum: ['submitted', 'assigned', 'in-progress', 'resolved'], default: 'submitted' },
    location: { type: String },
    coordinates: { lat: Number, lng: Number },
    imageUrl: { type: String },
    assignedOfficer: { type: String, default: 'Unassigned' },
    resolutionNote: { type: String, default: '' },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

complaintSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const count = await mongoose.model('Complaint').countDocuments();
    const year = new Date().getFullYear();
    this.ticketId = `ECO-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
