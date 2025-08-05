const mongoose = require('mongoose');

const caseAccessSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  organizationId: {
    type: String,
    required: true
  },
  accessType: {
    type: String,
    enum: ['direct', 'forwarded', 'consent_given'],
    required: true
  },
  permissions: [{
    type: String,
    enum: ['view', 'edit', 'forward', 'access_evidence'],
    required: true
  }],
  accessGrantedAt: {
    type: Date,
    default: Date.now
  },
  accessExpiresAt: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastAccessedAt: {
    type: Date
  },
  accessCount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
caseAccessSchema.index({ caseId: 1, adminId: 1 });
caseAccessSchema.index({ organizationId: 1 });
caseAccessSchema.index({ accessExpiresAt: 1 });
caseAccessSchema.index({ isActive: 1 });

// Method to check if access is still valid
caseAccessSchema.methods.isValid = function() {
  return this.isActive && new Date() < this.accessExpiresAt;
};

// Method to record access
caseAccessSchema.methods.recordAccess = function() {
  this.lastAccessedAt = new Date();
  this.accessCount += 1;
  return this.save();
};

// Static method to find active access for a case
caseAccessSchema.statics.findActiveAccess = function(caseId, adminId) {
  return this.findOne({
    caseId,
    adminId,
    isActive: true,
    accessExpiresAt: { $gt: new Date() }
  });
};

// Static method to find all cases accessible by an admin
caseAccessSchema.statics.findAccessibleCases = function(adminId) {
  return this.find({
    adminId,
    isActive: true,
    accessExpiresAt: { $gt: new Date() }
  }).populate('caseId');
};

module.exports = mongoose.model('CaseAccess', caseAccessSchema); 