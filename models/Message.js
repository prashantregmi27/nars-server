const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: [true, 'Sender is required']
  },
  recipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }],
  subject: String,
  body: {
    type: String,
    required: [true, 'Message body is required']
  },
  isGroup: {
    type: Boolean,
    default: false
  },
  channel: {
    type: String,
    enum: ['direct', 'team', 'announcement'],
    default: 'direct'
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }],
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  attachments: [String],
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
