const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Evidence = require('../models/Evidence');
const { auth } = require('../middleware/auth');
const { validateEvidence, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'audio/mpeg', 'audio/wav', 'audio/ogg',
    'video/mp4', 'video/webm', 'video/ogg',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

// Get all evidence for a user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, incidentId, fileType } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = { userId: req.user._id };
    if (incidentId) query.incidentId = incidentId;
    if (fileType) query.fileType = fileType;
    
    const evidence = await Evidence.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Evidence.countDocuments(query);
    
    res.json({
      evidence: evidence.map(item => item.getSummary()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get evidence error:', error);
    res.status(500).json({ error: 'Server error while fetching evidence' });
  }
});

// Get evidence by incident
router.get('/incident/:incidentId', auth, async (req, res) => {
  try {
    const evidence = await Evidence.findByIncident(req.params.incidentId, req.user._id);
    res.json({
      evidence: evidence.map(item => item.getSummary())
    });
  } catch (error) {
    console.error('Get evidence by incident error:', error);
    res.status(500).json({ error: 'Server error while fetching evidence' });
  }
});

// Upload evidence file
router.post('/upload', auth, upload.single('file'), validateEvidence, handleValidationErrors, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { incidentId, description, tags } = req.body;
    
    // Determine file type
    const mimeType = req.file.mimetype;
    let fileType = 'other';
    
    if (mimeType.startsWith('image/')) fileType = 'image';
    else if (mimeType.startsWith('audio/')) fileType = 'audio';
    else if (mimeType.startsWith('video/')) fileType = 'video';
    else if (mimeType.startsWith('application/') || mimeType.startsWith('text/')) fileType = 'document';
    
    // Generate file hash
    const fileBuffer = fs.readFileSync(req.file.path);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    
    // Create evidence record
    const evidence = new Evidence({
      userId: req.user._id,
      incidentId,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileType,
      mimeType,
      fileSize: req.file.size,
      filePath: req.file.filename,
      description: description || '',
      hash,
      tags: tags ? JSON.parse(tags) : []
    });
    
    await evidence.save();
    
    res.status(201).json({
      message: 'Evidence uploaded successfully',
      evidence: evidence.getSummary()
    });
  } catch (error) {
    console.error('Upload evidence error:', error);
    res.status(500).json({ error: 'Server error while uploading evidence' });
  }
});

// Get evidence statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const stats = await Evidence.getStats(req.user._id);
    
    if (stats.length === 0) {
      return res.json({
        totalFiles: 0,
        totalSize: 0,
        byType: {}
      });
    }
    
    const result = stats[0];
    
    // Process type stats
    const typeStats = {};
    result.byType.forEach(item => {
      typeStats[item.fileType] = (typeStats[item.fileType] || 0) + item.count;
    });
    
    res.json({
      totalFiles: result.totalFiles,
      totalSize: result.totalSize,
      byType: typeStats
    });
  } catch (error) {
    console.error('Get evidence stats error:', error);
    res.status(500).json({ error: 'Server error while fetching statistics' });
  }
});

// Delete evidence
router.delete('/:id', auth, async (req, res) => {
  try {
    const evidence = await Evidence.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!evidence) {
      return res.status(404).json({ error: 'Evidence not found' });
    }
    
    // Delete file from filesystem
    const filePath = path.join(process.env.UPLOAD_PATH || './uploads', evidence.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete from database
    await Evidence.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Evidence deleted successfully' });
  } catch (error) {
    console.error('Delete evidence error:', error);
    res.status(500).json({ error: 'Server error while deleting evidence' });
  }
});

module.exports = router; 