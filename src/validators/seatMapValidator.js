const { body, query, param } = require('express-validator');
const { validate } = require('../middleware/validator');
const mongoose = require('mongoose');

exports.validateCreateSeatMap = validate([
  body('busId')
    .notEmpty()
    .withMessage('Bus ID is required')
    .custom((busId) => {
      if (!mongoose.Types.ObjectId.isValid(busId)) {
        throw new Error('Invalid bus ID format');
      }
      return true;
    }),

  body('layout')
    .isArray()
    .withMessage('Layout must be an array')
    .notEmpty()
    .withMessage('Layout cannot be empty')
    .custom((layout) => {
      layout.forEach((seat) => {
        if (!seat.seatNumber || !seat.row || !seat.column) {
          throw new Error('Each seat in the layout must have seatNumber, row, and column');
        }
      });
      return true;
    }),

  body('layout.*.seatNumber').notEmpty().withMessage('Seat number is required for each seat'),

  body('layout.*.row').isInt({ min: 0 }).withMessage('Row number must be a positive integer'),

  body('layout.*.column').isInt({ min: 0 }).withMessage('Column number must be a positive integer'),

  body('layout.*.type')
    .optional()
    .isIn(['regular', 'luxury', 'disabled'])
    .withMessage('Seat type must be one of regular, luxury, or disabled'),
]);

exports.validateUpdateSeatMap = validate([
  body('busId')
    .optional()
    .custom((busId) => {
      if (busId && !mongoose.Types.ObjectId.isValid(busId)) {
        throw new Error('Invalid bus ID format');
      }
      return true;
    }),

  body('layout')
    .optional()
    .isArray()
    .withMessage('Layout must be an array')
    .custom((layout) => {
      layout.forEach((seat) => {
        if (!seat.seatNumber || !seat.row || !seat.column) {
          throw new Error('Each seat in the layout must have seatNumber, row, and column');
        }
      });
      return true;
    }),

  body('layout.*.seatNumber').optional().notEmpty().withMessage('Seat number is required for each seat'),

  body('layout.*.row').optional().isInt({ min: 0 }).withMessage('Row number must be a positive integer'),

  body('layout.*.column').optional().isInt({ min: 0 }).withMessage('Column number must be a positive integer'),

  body('layout.*.type')
    .optional()
    .isIn(['regular', 'luxury', 'disabled'])
    .withMessage('Seat type must be one of regular, luxury, or disabled'),
]);

exports.validateSeatMapId = validate([
  param('seatMapId')
    .notEmpty()
    .withMessage('Seat map ID is required')
    .custom((seatMapId) => {
      if (!mongoose.Types.ObjectId.isValid(seatMapId)) {
        throw new Error('Invalid seat map ID format');
      }
      return true;
    }),
]);

exports.validateSeatMapFilters = validate([
  query('busId')
    .optional()
    .custom((busId) => {
      if (busId && !mongoose.Types.ObjectId.isValid(busId)) {
        throw new Error('Invalid bus ID format');
      }
      return true;
    }),

  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),

  query('sort')
    .optional()
    .isIn(['seatNumber', '-seatNumber', 'row', '-row', 'column', '-column'])
    .withMessage('Sort must be a valid field (seatNumber, row, column) with optional "-" for descending order'),
]);
