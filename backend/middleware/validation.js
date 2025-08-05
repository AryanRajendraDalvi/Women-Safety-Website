const { body, validationResult } = require('express-validator');

// Validation rules for user registration
const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('language')
    .isIn(['english', 'hindi', 'marathi', 'tamil'])
    .withMessage('Invalid language selection')
];

// Validation rules for user login
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for incident creation
const validateIncident = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Location must be less than 500 characters'),
  
  body('witnesses')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Witnesses field must be less than 1000 characters'),
  
  body('severity')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity level'),
  
  body('category')
    .isIn([
      'verbal_harassment',
      'physical_harassment',
      'sexual_harassment',
      'discrimination',
      'bullying',
      'retaliation',
      'other'
    ])
    .withMessage('Invalid category'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each tag must be less than 50 characters')
];

// Validation rules for evidence upload
const validateEvidence = [
  body('incidentId')
    .isMongoId()
    .withMessage('Invalid incident ID'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each tag must be less than 50 characters')
];

// Validation rules for AI assistant
const validateAIAssistant = [
  body('incidentId')
    .isMongoId()
    .withMessage('Invalid incident ID'),
  
  body('type')
    .isIn(['complaint', 'summary', 'legal_advice'])
    .withMessage('Invalid AI assistant type'),
  
  body('language')
    .optional()
    .isIn(['english', 'hindi', 'marathi', 'tamil'])
    .withMessage('Invalid language selection')
];

// Generic validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateIncident,
  validateEvidence,
  validateAIAssistant,
  handleValidationErrors
}; 