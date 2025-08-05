const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  organizationId: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'admin_created',
      'view_case',
      'edit_case',
      'forward_case',
      'access_evidence',
      'export_data',
      'view_analytics',
      'grant_access',
      'revoke_access',
      'update_settings'
    ]
  },
  resourceType: {
    type: String,
    enum: ['case', 'evidence', 'user', 'admin', 'system'],
    required: true
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  success: {
    type: Boolean,
    default: true
  },
  errorMessage: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
auditLogSchema.index({ adminId: 1, timestamp: -1 });
auditLogSchema.index({ organizationId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });
auditLogSchema.index({ timestamp: -1 });

// Static method to log an action
auditLogSchema.statics.logAction = function(data) {
  return this.create({
    adminId: data.adminId,
    organizationId: data.organizationId,
    action: data.action,
    resourceType: data.resourceType,
    resourceId: data.resourceId,
    details: data.details,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    success: data.success !== false,
    errorMessage: data.errorMessage
  });
};

// Static method to get audit logs for an admin
auditLogSchema.statics.getAdminLogs = function(adminId, limit = 100) {
  return this.find({ adminId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('adminId', 'username organization.name');
};

// Static method to get audit logs for an organization
auditLogSchema.statics.getOrganizationLogs = function(organizationId, limit = 100) {
  return this.find({ organizationId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('adminId', 'username role');
};

// Static method to get audit logs for a specific case
auditLogSchema.statics.getCaseLogs = function(caseId, limit = 50) {
  return this.find({ 
    resourceType: 'case', 
    resourceId: caseId 
  })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('adminId', 'username organization.name role');
};

module.exports = mongoose.model('AuditLog', auditLogSchema); 