const { body, query, param } = require('express-validator');
const { validate } = require('../middleware/validator');
const mongoose = require('mongoose');

exports.validateCreateBus = validate([
  body('registrationNumber')
    .trim()
    .notEmpty()
    .withMessage('Registration number is required')
    .isLength({ max: 50 })
    .withMessage('Registration number must be less than 50 characters'),

  body('permit')
    .notEmpty()
    .withMessage('Permit is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid permit ID format');
      }
      return true;
    }),
  body('capacity').isInt({ min: 10, max: 80 }).withMessage('Capacity must be between 10 and 80'),
  body('manufacturer')
    .trim()
    .notEmpty()
    .withMessage('Manufacturer is required')
    .isLength({ max: 100 })
    .withMessage('Manufacturer must be less than 100 characters'),
  body('model').optional().isLength({ max: 100 }).withMessage('Model must be less than 100 characters'),
  body('yearOfManufacture')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Year of manufacture must be a valid year'),
  body('routes')
    .optional()
    .isArray()
    .withMessage('Routes must be an array of route IDs')
    .custom((value) => {
      if (value && value.length > 0) {
        value.forEach((route) => {
          if (!mongoose.Types.ObjectId.isValid(route)) {
            throw new Error('Each route must be a valid ID');
          }
        });
      }
      return true;
    }),
]);

exports.validateUpdateBus = validate([
  body('registrationNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Registration number must be less than 50 characters'),

  body('permit')
    .optional()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid permit ID format');
      }
      return true;
    }),

  body('capacity').optional().isInt({ min: 10, max: 80 }).withMessage('Capacity must be between 10 and 80'),

  body('manufacturer')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Manufacturer must be less than 100 characters'),

  body('model').optional().isLength({ max: 100 }).withMessage('Model must be less than 100 characters'),

  body('yearOfManufacture')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Year of manufacture must be a valid year'),

  body('routes')
    .optional()
    .isArray()
    .withMessage('Routes must be an array of route IDs')
    .custom((value) => {
      if (value && value.length > 0) {
        value.forEach((route) => {
          if (!mongoose.Types.ObjectId.isValid(route)) {
            throw new Error('Each route must be a valid ID');
          }
        });
      }
      return true;
    }),
]);

exports.validateBusId = validate([
  param('busId')
    .notEmpty()
    .withMessage('Bus ID is required')
    .custom((busId) => {
      if (!mongoose.Types.ObjectId.isValid(busId)) {
        throw new Error('Invalid bus ID format');
      }
      return true;
    }),
]);

exports.validateBusFilters = validate([
  query('status')
    .optional()
    .isIn(['active', 'maintenance', 'retired'])
    .withMessage('Status must be one of active, maintenance, or retired'),

  query('manufacturer').optional().isLength({ max: 100 }).withMessage('Manufacturer must be less than 100 characters'),

  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),

  query('sort')
    .optional()
    .isIn(['registrationNumber', '-registrationNumber', 'yearOfManufacture', '-yearOfManufacture'])
    .withMessage(
      'Sort must be either registrationNumber, -registrationNumber, yearOfManufacture, or -yearOfManufacture'
    ),
]);
