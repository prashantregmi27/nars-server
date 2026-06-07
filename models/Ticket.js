const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  description: String,
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  email: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'waiting', 'resolved', 'closed'],
    default: 'open'
  },
  category: String,
  messages: [{
    author: String,
    text: String,
    attachments: [String],
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
