const { body } = require('express-validator');
const mongoose = require('mongoose');
const Permit = require('../models/Permit');

exports.validateCreatePermit = [
  body('permitNumber')
    .notEmpty()
    .withMessage('Permit number is required')
    .custom(async (permitNumber) => {
      const existingPermit = await Permit.findOne({ permitNumber });
      if (existingPermit) {
        throw new Error('Permit number already exists');
      }
      return true;
    }),

  body('holderName').notEmpty().withMessage('Holder name is required'),

  body('vehicleType')
    .notEmpty()
    .withMessage('Vehicle type is required')
    .isIn(['bus', 'minibus', 'luxury'])
    .withMessage('Invalid vehicle type'),

  body('status').optional().isIn(['active', 'expired', 'suspended', 'cancelled']).withMessage('Invalid status'),

  body('issuedDate')
    .notEmpty()
    .withMessage('Issued date is required')
    .isISO8601()
    .withMessage('Invalid date format for issued date'),

  body('expiryDate')
    .notEmpty()
    .withMessage('Expiry date is required')
    .isISO8601()
    .withMessage('Invalid date format for expiry date')
    .custom((expiryDate, { req }) => {
      if (new Date(expiryDate) <= new Date(req.body.issuedDate)) {
        throw new Error('Expiry date must be later than the issued date');
      }
      return true;
    }),

  body('documents')
    .isArray()
    .withMessage('Documents must be an array')
    .custom((documents) => {
      if (documents.length === 0) {
        throw new Error('At least one document is required');
      }
      return true;
    }),
];

exports.validateUpdatePermit = [
  body('permitNumber')
    .optional()
    .custom(async (permitNumber, { req }) => {
      const existingPermit = await Permit.findOne({ permitNumber, _id: { $ne: req.params.permitId } });
      if (existingPermit) {
        throw new Error('Permit number already exists');
      }
      return true;
    }),

  body('holderName').optional().notEmpty().withMessage('Holder name cannot be empty'),

  body('vehicleType').optional().isIn(['bus', 'minibus', 'luxury']).withMessage('Invalid vehicle type'),

  body('status').optional().isIn(['active', 'expired', 'suspended', 'cancelled']).withMessage('Invalid status'),

  body('issuedDate').optional().isISO8601().withMessage('Invalid date format for issued date'),

  body('expiryDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format for expiry date')
    .custom((expiryDate, { req }) => {
      if (expiryDate && new Date(expiryDate) <= new Date(req.body.issuedDate)) {
        throw new Error('Expiry date must be later than the issued date');
      }
      return true;
    }),

  body('documents').optional().isArray().withMessage('Documents must be an array'),
];

exports.validatePermitId = [
  body('permitId')
    .notEmpty()
    .withMessage('Permit ID is required')
    .custom((permitId) => {
      if (!mongoose.Types.ObjectId.isValid(permitId)) {
        throw new Error('Invalid permit ID format');
      }
      return true;
    }),
];
