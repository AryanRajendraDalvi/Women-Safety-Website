const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['hr_admin', 'ngo_admin', 'legal_aid_admin'],
    required: true
  },
  organization: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    id: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      enum: ['corporation', 'ngo', 'legal_firm'],
      required: true
    }
  },
  permissions: [{
    type: String,
    enum: [
      'view_cases',
      'edit_cases', 
      'forward_cases',
      'access_evidence',
      'manage_users',
      'view_analytics',
      'export_data'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  sessionTimeout: {
    type: Number,
    default: 30 // minutes
  },
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
adminSchema.index({ username: 1 });
adminSchema.index({ email: 1 });
adminSchema.index({ 'organization.id': 1 });
adminSchema.index({ role: 1 });

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without password)
adminSchema.methods.toPublicJSON = function() {
  const adminObject = this.toObject();
  delete adminObject.password;
  return adminObject;
};

// Static method to find admin by username
adminSchema.statics.findByUsername = function(username) {
  return this.findOne({ username, isActive: true });
};

// Static method to find admin by email
adminSchema.statics.findByEmail = function(email) {
  return this.findOne({ email, isActive: true });
};

// Method to check permissions
adminSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

// Method to get default permissions based on role
adminSchema.methods.getDefaultPermissions = function() {
  const rolePermissions = {
    hr_admin: ['view_cases', 'edit_cases', 'forward_cases', 'access_evidence', 'view_analytics', 'export_data'],
    ngo_admin: ['view_cases', 'forward_cases', 'access_evidence', 'view_analytics'],
    legal_aid_admin: ['view_cases', 'access_evidence']
  };
  return rolePermissions[this.role] || [];
};

module.exports = mongoose.model('Admin', adminSchema); 