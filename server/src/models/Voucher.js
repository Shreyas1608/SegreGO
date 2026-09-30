const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    pointsCost: { type: Number, required: true },
    category: { type: String, enum: ['transit', 'shopping', 'eco-product', 'utility'], default: 'eco-product' },
    icon: { type: String, default: '🎟️' },
    discountValue: { type: String, required: true },
    terms: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Voucher', voucherSchema);
