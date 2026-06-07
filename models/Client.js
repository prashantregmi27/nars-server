const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required']
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true
  },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  industry: String,
  website: String,
  logo: String,
  contractFile: String,
  contractStart: Date,
  contractEnd: Date,
  paymentTerms: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'lead', 'churned'],
    default: 'lead'
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  communicationLog: [{
    type: {
      type: String,
      enum: ['email', 'call', 'meeting', 'note']
    },
    date: Date,
    summary: String,
    handledBy: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
