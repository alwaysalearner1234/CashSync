const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  paymentLinkId: { type: String },
  paymentUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  reminderCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
