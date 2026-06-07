const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  phone: String,
  photo: String,
  password: String,
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff', 'viewer'],
    default: 'staff'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  designation: String,
  joiningDate: Date,
  salary: Number,
  attendance: [{
    date: Date,
    status: {
      type: String,
      enum: ['present', 'absent', 'leave', 'half-day']
    }
  }],
  leaves: [{
    type: String,
    from: Date,
    to: Date,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }],
  performanceReviews: [{
    reviewer: String,
    date: Date,
    rating: Number,
    comments: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
