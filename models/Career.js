const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  position: { type: String, required: true, trim: true },
  coverLetter: { type: String, trim: true },
  resumeUrl: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Career', careerSchema);
