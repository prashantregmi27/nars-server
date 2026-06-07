const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  type: {
    type: String,
    enum: ['notice', 'announcement', 'news', 'alert'],
    default: 'notice'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  attachments: [String],
  expiresAt: Date,
  isPinned: {
    type: Boolean,
    default: false
  },
  targetAudience: {
    type: String,
    enum: ['all', 'staff', 'clients', 'management'],
    default: 'all'
  }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
