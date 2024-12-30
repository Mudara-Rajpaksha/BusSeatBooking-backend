const { body, query } = require('express-validator');
const { validate } = require('../middleware/validator');

exports.validateCreatePermit = validate([
  body('permitNumber')
    .trim()
    .notEmpty()
    .withMessage('Permit number is required')
    .isLength({ max: 50 })
    .withMessage('Permit number must be less than 50 characters'),

  body('holderName')
    .trim()
    .notEmpty()
    .withMessage('Holder name is required')
    .isLength({ max: 100 })
    .withMessage('Holder name must be less than 100 characters'),

  body('vehicleType')
    .notEmpty()
    .withMessage('Vehicle type is required')
    .isIn(['bus', 'minibus', 'luxury'])
    .withMessage('Vehicle type must be one of bus, minibus, or luxury'),

  body('status')
    .optional()
    .isIn(['active', 'expired', 'suspended', 'cancelled'])
    .withMessage('Status must be one of active, expired, suspended, or cancelled'),

  body('issuedDate')
    .notEmpty()
    .withMessage('Issued date is required')
    .isDate()
    .withMessage('Issued date must be a valid date'),

  body('expiryDate')
    .notEmpty()
    .withMessage('Expiry date is required')
    .isDate()
    .withMessage('Expiry date must be a valid date'),

  body('documents')
    .isArray()
    .withMessage('Documents must be an array of strings')
    .custom((value) => {
      if (value && value.length > 0) {
        value.forEach((doc) => {
          if (typeof doc !== 'string') {
            throw new Error('Each document must be a string');
          }
        });
      }
      return true;
    }),
]);

exports.validateUpdatePermit = validate([
  body('permitNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Permit number must be less than 50 characters'),

  body('holderName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Holder name must be less than 100 characters'),

  body('vehicleType')
    .optional()
    .isIn(['bus', 'minibus', 'luxury'])
    .withMessage('Vehicle type must be one of bus, minibus, or luxury'),

  body('status')
    .optional()
    .isIn(['active', 'expired', 'suspended', 'cancelled'])
    .withMessage('Status must be one of active, expired, suspended, or cancelled'),

  body('issuedDate')
    .notEmpty()
    .withMessage('Issued date is required')
    .custom((value) => {
      const parsedDate = Date.parse(value);
      if (isNaN(parsedDate)) {
        throw new Error('Issued date must be a valid date');
      }
      return true;
    }),

  body('expiryDate').optional().isDate().withMessage('Expiry date must be a valid date'),

  body('documents')
    .optional()
    .isArray()
    .withMessage('Documents must be an array of strings')
    .custom((value) => {
      if (value && value.length > 0) {
        value.forEach((doc) => {
          if (typeof doc !== 'string') {
            throw new Error('Each document must be a string');
          }
        });
      }
      return true;
    }),
]);

exports.validatePermitFilters = validate([
  query('status')
    .optional()
    .isIn(['active', 'expired', 'suspended', 'cancelled'])
    .withMessage('Status must be one of active, expired, suspended, or cancelled'),

  query('vehicleType')
    .optional()
    .isIn(['bus', 'minibus', 'luxury'])
    .withMessage('Vehicle type must be one of bus, minibus, or luxury'),

  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),

  query('sort')
    .optional()
    .isIn(['permitNumber', '-permitNumber', 'issuedDate', '-issuedDate'])
    .withMessage('Sort must be either permitNumber, -permitNumber, issuedDate, or -issuedDate'),
]);

exports.validatePermitId = validate([
  body('permitId')
    .notEmpty()
    .withMessage('Permit ID is required')
    .custom((permitId) => {
      if (!mongoose.Types.ObjectId.isValid(permitId)) {
        throw new Error('Invalid permit ID format');
      }
      return true;
    }),
]);
