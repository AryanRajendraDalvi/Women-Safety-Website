const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const AuditLog = require('../models/AuditLog');
const { validateAdminRegistration, validateAdminLogin, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Admin registration (public endpoint for creating admin accounts)
router.post('/register', validateAdminRegistration, handleValidationErrors, async (req, res) => {
  try {
    const { username, email, password, role, organization } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findByUsername(username) || await Admin.findByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists with this username or email' });
    }

    // Generate organization ID if not provided
    const organizationId = organization.id || `org-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create new admin
    const admin = new Admin({
      username,
      email,
      password,
      role,
      organization: {
        name: organization.name,
        id: organizationId,
        type: organization.type
      }
    });

    // Set default permissions based on role
    admin.permissions = admin.getDefaultPermissions();

    await admin.save();

    // Log the action (with error handling)
    try {
      await AuditLog.logAction({
        adminId: admin._id,
        organizationId: admin.organization.id,
        action: 'admin_created',
        resourceType: 'admin',
        resourceId: admin._id,
        details: { role, organization: admin.organization.name },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    } catch (auditError) {
      console.error('Audit log error (non-critical):', auditError);
      // Continue with registration even if audit logging fails
    }

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: admin.toPublicJSON()
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ error: 'Server error during admin registration' });
  }
});

// Admin login
router.post('/login', validateAdminLogin, handleValidationErrors, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin by username or email
    const admin = await Admin.findByUsername(username) || await Admin.findByEmail(username);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token with role and permissions
    const token = jwt.sign(
      { 
        adminId: admin._id,
        role: admin.role,
        organizationId: admin.organization.id,
        permissions: admin.permissions
      },
      process.env.JWT_SECRET || 'your-secret-key-here-make-it-long-and-secure',
      { expiresIn: `${admin.sessionTimeout}m` }
    );

    // Log the login
    await AuditLog.logAction({
      adminId: admin._id,
      organizationId: admin.organization.id,
      action: 'login',
      resourceType: 'system',
      details: { loginMethod: 'username' },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      message: 'Login successful',
      token,
      admin: admin.toPublicJSON()
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current admin profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here-make-it-long-and-secure');
    const admin = await Admin.findById(decoded.adminId).select('-password');
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({
      admin: admin.toPublicJSON()
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Admin logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here-make-it-long-and-secure');
      
      // Log the logout
      await AuditLog.logAction({
        adminId: decoded.adminId,
        organizationId: decoded.organizationId,
        action: 'logout',
        resourceType: 'system',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({ error: 'Server error during logout' });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Generate new token
    const newToken = jwt.sign(
      { 
        adminId: admin._id,
        role: admin.role,
        organizationId: admin.organization.id,
        permissions: admin.permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: `${admin.sessionTimeout}m` }
    );

    res.json({
      token: newToken,
      admin: admin.toPublicJSON()
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router; 