const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  summary: { type: String, required: true, trim: true },
  content: { type: String, trim: true },
  imageUrl: { type: String, trim: true },
  author: { type: String, trim: true },
  publishedDate: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: true },
});

module.exports = mongoose.model('News', newsSchema);
