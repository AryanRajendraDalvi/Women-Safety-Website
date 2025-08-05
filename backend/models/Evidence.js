const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  incidentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
    required: true
  },
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['image', 'audio', 'video', 'document', 'other']
  },
  mimeType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  isEncrypted: {
    type: Boolean,
    default: true
  },
  encryptionKey: {
    type: String,
    default: null
  },
  hash: {
    type: String,
    required: true
  },
  metadata: {
    width: Number,
    height: Number,
    duration: Number,
    location: String,
    timestamp: Date
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
evidenceSchema.index({ userId: 1, incidentId: 1 });
evidenceSchema.index({ fileType: 1 });
evidenceSchema.index({ createdAt: -1 });
evidenceSchema.index({ hash: 1 });

// Virtual for file URL
evidenceSchema.virtual('fileUrl').get(function() {
  return `/uploads/${this.filePath}`;
});

// Virtual for formatted file size
evidenceSchema.virtual('formattedSize').get(function() {
  const bytes = this.fileSize;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Method to get evidence summary
evidenceSchema.methods.getSummary = function() {
  return {
    id: this._id,
    fileName: this.fileName,
    originalName: this.originalName,
    fileType: this.fileType,
    fileSize: this.fileSize,
    formattedSize: this.formattedSize,
    createdAt: this.createdAt,
    description: this.description
  };
};

// Static method to get evidence by incident
evidenceSchema.statics.findByIncident = function(incidentId, userId) {
  return this.find({ incidentId, userId })
    .sort({ createdAt: -1 });
};

// Static method to get evidence by type
evidenceSchema.statics.findByType = function(userId, fileType) {
  return this.find({ userId, fileType })
    .sort({ createdAt: -1 });
};

// Static method to get evidence statistics
evidenceSchema.statics.getStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalFiles: { $sum: 1 },
        totalSize: { $sum: '$fileSize' },
        byType: {
          $push: {
            fileType: '$fileType',
            count: 1
          }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Evidence', evidenceSchema); 