const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Document name is required']
  },
  originalName: String,
  description: String,
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileSize: Number,
  fileType: String,
  folder: String,
  tags: [String],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  version: {
    type: Number,
    default: 1
  },
  versionHistory: [{
    version: Number,
    fileUrl: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff'
    },
    uploadedAt: Date,
    comment: String
  }],
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
