const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  location: {
    type: String,
    trim: true,
    maxlength: 500
  },
  witnesses: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: [
      'verbal_harassment',
      'physical_harassment',
      'sexual_harassment',
      'discrimination',
      'bullying',
      'retaliation',
      'other'
    ],
    default: 'other'
  },
  submissionDestination: {
    type: String,
    enum: ['hr', 'ngo', 'legal_aid'],
    required: true
  },
  organizationName: {
    type: String,
    trim: true,
    maxlength: 100,
    required: function() {
      return this.submissionDestination === 'hr';
    }
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'resolved', 'closed'],
    default: 'draft'
  },
  isEncrypted: {
    type: Boolean,
    default: true
  },
  encryptedData: {
    type: String,
    default: null
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
incidentSchema.index({ userId: 1, createdAt: -1 });
incidentSchema.index({ severity: 1 });
incidentSchema.index({ status: 1 });
incidentSchema.index({ category: 1 });

// Virtual for formatted date
incidentSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Method to get incident summary
incidentSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    severity: this.severity,
    category: this.category,
    status: this.status,
    location: this.location,
    witnesses: this.witnesses,
    submissionDestination: this.submissionDestination,
    organizationName: this.organizationName,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    timestamp: this.createdAt // For compatibility with frontend
  };
};

// Static method to get incidents by user
incidentSchema.statics.findByUser = function(userId, options = {}) {
  const { page = 1, limit = 10, status, severity, category } = options;
  const skip = (page - 1) * limit;
  
  let query = { userId };
  
  if (status) query.status = status;
  if (severity) query.severity = severity;
  if (category) query.category = category;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get incident statistics
incidentSchema.statics.getStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        bySeverity: {
          $push: {
            severity: '$severity',
            count: 1
          }
        },
        byStatus: {
          $push: {
            status: '$status',
            count: 1
          }
        },
        byCategory: {
          $push: {
            category: '$category',
            count: 1
          }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Incident', incidentSchema); 