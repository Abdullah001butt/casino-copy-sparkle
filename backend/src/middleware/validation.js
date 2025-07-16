import { body, validationResult } from 'express-validator';

// Blog validation rules
export const validateBlogCreate = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('slug')
    .notEmpty()
    .withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  
  body('excerpt')
    .notEmpty()
    .withMessage('Excerpt is required')
    .isLength({ max: 500 })
    .withMessage('Excerpt cannot exceed 500 characters'),
  
  body('content')
    .notEmpty()
    .withMessage('Content is required'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'game-guides',
      'strategies', 
      'news',
      'promotions',
      'winner-stories',
      'industry-updates',
      'new-releases',
      'tips-tricks',
      'responsible-gambling'
    ])
    .withMessage('Invalid category'),
  
  // Fix URL validation to allow localhost
  body('featuredImage.url')
    .optional()
    .custom((value) => {
      if (!value) return true;
      
      // Allow localhost URLs for development
      const urlPattern = /^(https?:\/\/)?(localhost|127\.0\.0\.1|[\w\-\.]+\.[a-z]{2,})(:\d+)?(\/.*)?$/i;
      
      if (!urlPattern.test(value)) {
        throw new Error('Featured image must be a valid URL');
      }
      return true;
    }),
  
  body('metaTitle')
    .optional()
    .isLength({ max: 60 })
    .withMessage('Meta title cannot exceed 60 characters'),
  
  body('metaDescription')
    .optional()
    .isLength({ max: 160 })
    .withMessage('Meta description cannot exceed 160 characters'),
];

export const validateBlogUpdate = [
  body('title')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('slug')
    .optional()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  
  body('excerpt')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Excerpt cannot exceed 500 characters'),
  
  body('category')
    .optional()
    .isIn([
      'game-guides',
      'strategies', 
      'news',
      'promotions',
      'winner-stories',
      'industry-updates',
      'new-releases',
      'tips-tricks',
      'responsible-gambling'
    ])
    .withMessage('Invalid category'),
  
  // Fix URL validation to allow localhost
  body('featuredImage.url')
    .optional()
    .custom((value) => {
      if (!value) return true;
      
      // Allow localhost URLs for development
      const urlPattern = /^(https?:\/\/)?(localhost|127\.0\.0\.1|[\w\-\.]+\.[a-z]{2,})(:\d+)?(\/.*)?$/i;
      
      if (!urlPattern.test(value)) {
        throw new Error('Featured image must be a valid URL');
      }
      return true;
    }),
  
  body('metaTitle')
    .optional()
    .isLength({ max: 60 })
    .withMessage('Meta title cannot exceed 60 characters'),
  
  body('metaDescription')
    .optional()
    .isLength({ max: 160 })
    .withMessage('Meta description cannot exceed 160 characters'),
];

// Login validation
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};
