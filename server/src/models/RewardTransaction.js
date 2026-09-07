const mongoose = require('mongoose');

const rewardTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    points: { type: Number, required: true },
    reason: { type: String },
    verificationStatus: { type: String, enum: ['verified', 'pending', 'flagged'], default: 'verified' },
    referenceId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RewardTransaction', rewardTransactionSchema);
