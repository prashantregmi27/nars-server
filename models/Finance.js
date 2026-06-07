const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['income', 'expense', 'invoice'],
    required: [true, 'Type is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  description: String,
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank', 'card', 'online', 'cheque']
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'overdue', 'cancelled'],
    default: 'pending'
  },
  invoiceNumber: String,
  invoiceDate: Date,
  dueDate: Date,
  paidDate: Date,
  taxAmount: Number,
  taxRate: Number,
  receipt: String,
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }
}, { timestamps: true });

module.exports = mongoose.model('Finance', financeSchema);
