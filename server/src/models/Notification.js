const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['bin-alert', 'collection', 'complaint', 'reward', 'level-up', 'challenge', 'general'], default: 'general' },
    isRead: { type: Boolean, default: false },
    referenceId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
