const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  designation: { type: String, trim: true },
  imageUrl: { type: String, trim: true },
  bio: { type: String, trim: true },
  specialties: [{ type: String }],
  office: { type: String, trim: true },
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model('Partner', partnerSchema);
