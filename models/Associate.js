const mongoose = require('mongoose');

const associateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  phone: String,
  photo: String,
  designation: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  experience: [{
    company: String,
    role: String,
    from: Date,
    to: Date,
    description: String
  }],
  skills: [String],
  bio: String,
  performanceRating: {
    type: Number,
    min: 1,
    max: 5
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  joinDate: Date,
  lastActive: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Associate', associateSchema);
