const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: String,
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: Date,
  allDay: {
    type: Boolean,
    default: false
  },
  location: String,
  virtualLink: String,
  type: {
    type: String,
    enum: ['meeting', 'deadline', 'holiday', 'event', 'reminder'],
    default: 'event'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  color: String,
  remindBefore: {
    type: Number,
    description: 'Minutes before the event to remind'
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
