const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const AuditLog = require('../models/AuditLog');

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here-make-it-long-and-secure');
    
    // Check if admin exists and is active
    const admin = await Admin.findById(decoded.adminId);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: 'Invalid or inactive admin account' });
    }

    // Check if session has expired
    const tokenExp = decoded.exp * 1000; // Convert to milliseconds
    if (Date.now() > tokenExp) {
      return res.status(401).json({ error: 'Session expired' });
    }

    // Add admin info to request
    req.admin = {
      adminId: admin._id,
      username: admin.username,
      role: admin.role,
      organizationId: admin.organization.id,
      organizationName: admin.organization.name,
      permissions: admin.permissions
    };

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Permission checking middleware
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!req.admin.permissions.includes(requiredPermission)) {
      return res.status(403).json({ 
        error: `Permission denied. Required: ${requiredPermission}` 
      });
    }

    next();
  };
};

// Role checking middleware
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({ 
        error: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};

// Session timeout middleware
const checkSessionTimeout = async (req, res, next) => {
  try {
    if (!req.admin) {
      return next();
    }

    const admin = await Admin.findById(req.admin.adminId);
    if (!admin) {
      return res.status(401).json({ error: 'Admin not found' });
    }

    const lastActivity = admin.lastLogin;
    const sessionTimeoutMs = admin.sessionTimeout * 60 * 1000; // Convert minutes to milliseconds
    
    if (Date.now() - lastActivity.getTime() > sessionTimeoutMs) {
      // Log the session timeout
      await AuditLog.logAction({
        adminId: req.admin.adminId,
        organizationId: req.admin.organizationId,
        action: 'session_timeout',
        resourceType: 'system',
        details: { sessionTimeout: admin.sessionTimeout },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.status(401).json({ error: 'Session timeout. Please login again.' });
    }

    // Update last activity
    admin.lastLogin = new Date();
    await admin.save();

    next();
  } catch (error) {
    console.error('Session timeout check error:', error);
    next();
  }
};

module.exports = {
  adminAuth,
  checkPermission,
  checkRole,
  checkSessionTimeout
}; 