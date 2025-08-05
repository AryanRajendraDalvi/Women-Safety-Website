const express = require('express');
const Incident = require('../models/Incident');
const { auth } = require('../middleware/auth');
const { validateIncident, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Get all incidents for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, severity, category } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      severity,
      category
    };

    const incidents = await Incident.findByUser(req.user._id, options);
    const total = await Incident.countDocuments({ userId: req.user._id });

    res.json({
      incidents: incidents.map(incident => incident.getSummary()),
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    });
  } catch (error) {
    console.error('Get incidents error:', error);
    res.status(500).json({ error: 'Server error while fetching incidents' });
  }
});

// Get a specific incident by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const incident = await Incident.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json({ incident });
  } catch (error) {
    console.error('Get incident error:', error);
    res.status(500).json({ error: 'Server error while fetching incident' });
  }
});

// Create a new incident
router.post('/', auth, validateIncident, handleValidationErrors, async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      witnesses,
      severity,
      category,
      submissionDestination,
      organizationName,
      tags
    } = req.body;

    const incident = new Incident({
      userId: req.user._id,
      title,
      description,
      location,
      witnesses,
      severity,
      category,
      submissionDestination,
      organizationName,
      tags: tags || []
    });

    await incident.save();

    res.status(201).json({
      message: 'Incident created successfully',
      incident: incident.getSummary()
    });
  } catch (error) {
    console.error('Create incident error:', error);
    res.status(500).json({ error: 'Server error while creating incident' });
  }
});

module.exports = router; 