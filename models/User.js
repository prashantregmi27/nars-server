const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'manager', 'staff', 'viewer'],
    default: 'staff'
  },
  staffProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  avatar: String,
  lastLogin: Date,
  status: {
    type: String,
    enum: ['active', 'inactive', 'locked'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
