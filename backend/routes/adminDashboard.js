const express = require('express');
const Incident = require('../models/Incident');
const CaseAccess = require('../models/CaseAccess');
const AuditLog = require('../models/AuditLog');
const { adminAuth, checkPermission } = require('../middleware/adminAuth');

const router = express.Router();

// Get dashboard overview and metrics
router.get('/overview', adminAuth, async (req, res) => {
  try {
    const { adminId, organizationId, role } = req.admin;

    // Get ALL cases for ALL admins - no filtering by organization, submission destination, or category
    let accessibleCases = await Incident.find({}).sort({ createdAt: -1 });

    // Calculate metrics
    const totalCases = accessibleCases.length;
    const newCases = accessibleCases.filter(case_ => 
      case_.status === 'submitted' && 
      new Date(case_.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    const openCases = accessibleCases.filter(case_ => 
      ['submitted', 'under_review', 'under_investigation'].includes(case_.status)
    ).length;
    const closedCases = accessibleCases.filter(case_ => 
      ['resolved', 'closed'].includes(case_.status)
    ).length;

    // Cases by status
    const casesByStatus = {
      submitted: accessibleCases.filter(case_ => case_.status === 'submitted').length,
      under_review: accessibleCases.filter(case_ => case_.status === 'under_review').length,
      under_investigation: accessibleCases.filter(case_ => case_.status === 'under_investigation').length,
      resolved: accessibleCases.filter(case_ => case_.status === 'resolved').length,
      closed: accessibleCases.filter(case_ => case_.status === 'closed').length,
      escalated: accessibleCases.filter(case_ => case_.status === 'escalated').length
    };

    // Recent activity (last 10 cases)
    const recentCases = accessibleCases.slice(0, 10);

    res.json({
      metrics: {
        totalCases,
        newCases,
        openCases,
        closedCases
      },
      casesByStatus,
      recentCases: recentCases.map(case_ => ({
        id: case_._id,
        title: case_.title,
        status: case_.status,
        severity: case_.severity,
        createdAt: case_.createdAt,
        category: case_.category,
        submissionDestination: case_.submissionDestination,
        organizationName: case_.organizationName
      }))
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ error: 'Server error while fetching dashboard overview' });
  }
});

// Get analytics data
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const { adminId, organizationId, role } = req.admin;

    // Get all cases for analytics
    const allCases = await Incident.find({}).sort({ createdAt: -1 });

    // Calculate metrics
    const totalCases = allCases.length;
    const newCases = allCases.filter(case_ => 
      case_.status === 'submitted' && 
      new Date(case_.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    const openCases = allCases.filter(case_ => 
      ['submitted', 'under_review', 'under_investigation'].includes(case_.status)
    ).length;
    const closedCases = allCases.filter(case_ => 
      ['resolved', 'closed'].includes(case_.status)
    ).length;

    // Cases by status
    const casesByStatus = {
      draft: allCases.filter(case_ => case_.status === 'draft').length,
      submitted: allCases.filter(case_ => case_.status === 'submitted').length,
      under_review: allCases.filter(case_ => case_.status === 'under_review').length,
      resolved: allCases.filter(case_ => case_.status === 'resolved').length,
      closed: allCases.filter(case_ => case_.status === 'closed').length
    };

    // Cases by severity
    const casesBySeverity = {
      low: allCases.filter(case_ => case_.severity === 'low').length,
      medium: allCases.filter(case_ => case_.severity === 'medium').length,
      high: allCases.filter(case_ => case_.severity === 'high').length,
      critical: allCases.filter(case_ => case_.severity === 'critical').length
    };

    // Cases by category
    const casesByCategory = {};
    allCases.forEach(case_ => {
      const category = case_.category || 'uncategorized';
      casesByCategory[category] = (casesByCategory[category] || 0) + 1;
    });

    // Recent activity (last 10 cases)
    const recentActivity = allCases.slice(0, 10).map(case_ => ({
      id: case_._id,
      title: case_.title,
      status: case_.status,
      createdAt: case_.createdAt
    }));

    res.json({
      totalCases,
      newCases,
      openCases,
      closedCases,
      casesByStatus,
      casesBySeverity,
      casesByCategory,
      recentActivity
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Server error while fetching analytics' });
  }
});

// Get all accessible cases with pagination and filtering
router.get('/cases', adminAuth, checkPermission('view_cases'), async (req, res) => {
  try {
    const { adminId, organizationId, role } = req.admin;
    const { page = 1, limit = 20, status, severity, category, search } = req.query;

    // Build query to get ALL cases - no filtering by role, organization, or submission destination
    let query = {};

    // Add filters
    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const cases = await Incident.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('title status severity category createdAt location submissionDestination organizationName');

    const total = await Incident.countDocuments(query);

    // Log the action
    await AuditLog.logAction({
      adminId,
      organizationId,
      action: 'view_cases',
      resourceType: 'case',
      details: { filters: req.query, count: cases.length },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      cases,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get cases error:', error);
    res.status(500).json({ error: 'Server error while fetching cases' });
  }
});

// Get specific case details
router.get('/cases/:caseId', adminAuth, checkPermission('view_cases'), async (req, res) => {
  try {
    const { adminId, organizationId, role } = req.admin;
    const { caseId } = req.params;

    // Check access permissions
    let hasAccess = false;
    if (role === 'hr_admin') {
      const case_ = await Incident.findById(caseId);
      hasAccess = case_ && case_.organizationId === organizationId;
    } else {
      const caseAccess = await CaseAccess.findActiveAccess(caseId, adminId);
      hasAccess = !!caseAccess;
    }

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this case' });
    }

    const case_ = await Incident.findById(caseId);
    if (!case_) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Log the action
    await AuditLog.logAction({
      adminId,
      organizationId,
      action: 'view_case',
      resourceType: 'case',
      resourceId: caseId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ case: case_ });
  } catch (error) {
    console.error('Get case details error:', error);
    res.status(500).json({ error: 'Server error while fetching case details' });
  }
});

// Update case status
router.put('/cases/:caseId/status', adminAuth, checkPermission('edit_cases'), async (req, res) => {
  try {
    const { adminId, organizationId, role } = req.admin;
    const { caseId } = req.params;
    const { status, notes } = req.body;

    // Check access permissions
    let hasAccess = false;
    if (role === 'hr_admin') {
      const case_ = await Incident.findById(caseId);
      hasAccess = case_ && case_.organizationId === organizationId;
    } else {
      const caseAccess = await CaseAccess.findActiveAccess(caseId, adminId);
      hasAccess = caseAccess && caseAccess.permissions.includes('edit');
    }

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to edit this case' });
    }

    const case_ = await Incident.findByIdAndUpdate(
      caseId,
      { 
        status,
        updatedAt: new Date(),
        $push: { 
          adminNotes: {
            adminId,
            status,
            notes,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    if (!case_) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Log the action
    await AuditLog.logAction({
      adminId,
      organizationId,
      action: 'edit_case',
      resourceType: 'case',
      resourceId: caseId,
      details: { status, notes },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ 
      message: 'Case status updated successfully',
      case: case_
    });
  } catch (error) {
    console.error('Update case status error:', error);
    res.status(500).json({ error: 'Server error while updating case status' });
  }
});

// Forward case to another organization
router.post('/cases/:caseId/forward', adminAuth, checkPermission('forward_cases'), async (req, res) => {
  try {
    const { adminId, organizationId, role } = req.admin;
    const { caseId } = req.params;
    const { targetOrganizationId, targetRole, notes, accessDuration = 7 } = req.body;

    // Check access permissions
    let hasAccess = false;
    if (role === 'hr_admin') {
      const case_ = await Incident.findById(caseId);
      hasAccess = case_ && case_.organizationId === organizationId;
    } else {
      const caseAccess = await CaseAccess.findActiveAccess(caseId, adminId);
      hasAccess = caseAccess && caseAccess.permissions.includes('forward');
    }

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to forward this case' });
    }

    // Create case access for target organization
    const accessExpiresAt = new Date();
    accessExpiresAt.setDate(accessExpiresAt.getDate() + accessDuration);

    const caseAccess = new CaseAccess({
      caseId,
      organizationId: targetOrganizationId,
      accessType: 'forwarded',
      permissions: ['view', 'access_evidence'],
      accessExpiresAt,
      notes
    });

    await caseAccess.save();

    // Log the action
    await AuditLog.logAction({
      adminId,
      organizationId,
      action: 'forward_case',
      resourceType: 'case',
      resourceId: caseId,
      details: { 
        targetOrganizationId, 
        targetRole, 
        accessDuration,
        notes 
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ 
      message: 'Case forwarded successfully',
      caseAccess: caseAccess
    });
  } catch (error) {
    console.error('Forward case error:', error);
    res.status(500).json({ error: 'Server error while forwarding case' });
  }
});

// Get audit logs for the organization
router.get('/audit-logs', adminAuth, checkPermission('view_analytics'), async (req, res) => {
  try {
    const { organizationId } = req.admin;
    const { page = 1, limit = 50, action, adminId: filterAdminId } = req.query;

    let query = { organizationId };
    if (action) query.action = action;
    if (filterAdminId) query.adminId = filterAdminId;

    const skip = (page - 1) * limit;
    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('adminId', 'username role');

    const total = await AuditLog.countDocuments(query);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Server error while fetching audit logs' });
  }
});

// Get audit logs with pagination and filtering
router.get('/audit-logs', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, action } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (search) {
      query.$or = [
        { adminName: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
        { resourceType: { $regex: search, $options: 'i' } }
      ];
    }
    if (action) {
      query.action = action;
    }

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('adminId adminName action resourceType details timestamp ipAddress');

    const total = await AuditLog.countDocuments(query);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Audit logs error:', error);
    res.status(500).json({ error: 'Server error while fetching audit logs' });
  }
});

// Export data as CSV
router.get('/export', adminAuth, async (req, res) => {
  try {
    const { adminId, organizationId, role } = req.admin;

    // Get all cases for export
    const allCases = await Incident.find({})
      .sort({ createdAt: -1 })
      .select('title status severity category createdAt location submissionDestination organizationName description');

    // Create CSV content
    const csvHeaders = [
      'Title',
      'Status',
      'Severity',
      'Category',
      'Created Date',
      'Location',
      'Submission Destination',
      'Organization Name',
      'Description'
    ].join(',');

    const csvRows = allCases.map(case_ => [
      `"${case_.title || ''}"`,
      `"${case_.status || ''}"`,
      `"${case_.severity || ''}"`,
      `"${case_.category || ''}"`,
      `"${new Date(case_.createdAt).toLocaleDateString()}"`,
      `"${case_.location || ''}"`,
      `"${case_.submissionDestination || ''}"`,
      `"${case_.organizationName || ''}"`,
      `"${(case_.description || '').replace(/"/g, '""')}"` // Escape quotes in description
    ].join(','));

    const csvContent = [csvHeaders, ...csvRows].join('\n');

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="safespace-data-${new Date().toISOString().split('T')[0]}.csv"`);
    
    res.send(csvContent);

    // Log the export action
    await AuditLog.logAction({
      adminId,
      organizationId,
      action: 'export_data',
      resourceType: 'data_export',
      details: { 
        exportType: 'csv',
        recordCount: allCases.length,
        filters: 'all_cases'
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Server error while exporting data' });
  }
});

// Get individual case details
router.get('/cases/:caseId', adminAuth, async (req, res) => {
  try {
    const { caseId } = req.params;
    const { adminId, organizationId, role } = req.admin;

    const caseData = await Incident.findById(caseId)
      .select('title description status severity category location createdAt updatedAt submissionDestination organizationName');

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json(caseData);

    // Log the action
    await AuditLog.logAction({
      adminId,
      organizationId,
      action: 'view_case',
      resourceType: 'case',
      details: { caseId, caseTitle: caseData.title },
    });

  } catch (error) {
    console.error('Case detail error:', error);
    res.status(500).json({ error: 'Server error while fetching case details' });
  }
});

module.exports = router; 