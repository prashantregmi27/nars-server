const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  companyName: String,
  logo: String,
  favicon: String,
  address: String,
  phone: String,
  email: String,
  website: String,
  timezone: {
    type: String,
    default: 'UTC'
  },
  dateFormat: {
    type: String,
    default: 'YYYY-MM-DD'
  },
  currency: {
    type: String,
    default: 'USD'
  },
  taxRate: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    default: 'en'
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'auto'],
    default: 'light'
  },
  emailSettings: {
    host: String,
    port: Number,
    user: String,
    pass: String,
    fromName: String,
    fromEmail: String
  },
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    inApp: { type: Boolean, default: true }
  },
  security: {
    twoFactor: { type: Boolean, default: false },
    sessionTimeout: { type: Number, default: 30 },
    passwordPolicy: {
      minLength: { type: Number, default: 8 },
      requireUppercase: { type: Boolean, default: true },
      requireNumbers: { type: Boolean, default: true },
      requireSymbols: { type: Boolean, default: false }
    }
  },
  seoDefaults: {
    title: String,
    description: String,
    keywords: [String]
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
    youtube: String
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
