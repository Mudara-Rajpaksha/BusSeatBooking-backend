const { body } = require('express-validator');
const mongoose = require('mongoose');
const Bus = require('../models/Bus');
const Permit = require('../models/Permit');
const Route = require('../models/Route');

exports.validateCreateBus = [
  body('registrationNumber')
    .notEmpty()
    .withMessage('Registration number is required')
    .isLength({ min: 5, max: 20 })
    .withMessage('Registration number must be between 5 and 20 characters')
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage('Registration number must be alphanumeric')
    .custom(async (registrationNumber) => {
      const existingBus = await Bus.findOne({ registrationNumber });
      if (existingBus) {
        throw new Error('Registration number already exists');
      }
      return true;
    }),

  body('permit')
    .notEmpty()
    .withMessage('Permit ID is required')
    .custom(async (permitId) => {
      if (!mongoose.Types.ObjectId.isValid(permitId)) {
        throw new Error('Invalid permit ID format');
      }
      const permit = await Permit.findById(permitId);
      if (!permit) {
        throw new Error('Permit ID does not exist');
      }
      return true;
    }),

  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 10, max: 80 })
    .withMessage('Capacity must be between 10 and 80'),

  body('manufacturer')
    .notEmpty()
    .withMessage('Manufacturer is required')
    .isString()
    .withMessage('Manufacturer must be a string'),

  body('yearOfManufacture')
    .notEmpty()
    .withMessage('Year of manufacture is required')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Year of manufacture must be a valid year'),

  body('maintenanceHistory')
    .optional()
    .isArray()
    .withMessage('Maintenance history must be an array')
    .custom((history) => {
      if (history) {
        return history.every(
          (entry) =>
            entry.date &&
            typeof entry.date === 'string' &&
            typeof entry.description === 'string' &&
            typeof entry.cost === 'number'
        );
      }
      return true;
    })
    .withMessage('Invalid maintenance history format'),

  body('status')
    .optional()
    .isIn(['active', 'maintenance', 'retired'])
    .withMessage('Status must be one of "active", "maintenance", or "retired"'),

  body('routes')
    .optional()
    .isArray()
    .withMessage('Routes must be an array of route IDs')
    .custom(async (routes) => {
      if (routes) {
        const validRoutes = await Route.find({ _id: { $in: routes } });
        if (validRoutes.length !== routes.length) {
          throw new Error('One or more route IDs do not exist');
        }
      }
      return true;
    })
    .withMessage('Each route ID must be a valid ObjectId'),
];

exports.validateUpdateBus = [
  body('registrationNumber')
    .optional()
    .isLength({ min: 5, max: 20 })
    .withMessage('Registration number must be between 5 and 20 characters')
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage('Registration number must be alphanumeric')
    .custom(async (registrationNumber, { req }) => {
      const existingBus = await Bus.findOne({
        registrationNumber,
        _id: { $ne: req.params.busId },
      });
      if (existingBus) {
        throw new Error('Registration number already exists');
      }
      return true;
    }),

  body('permit')
    .optional()
    .custom(async (permitId) => {
      if (permitId && !mongoose.Types.ObjectId.isValid(permitId)) {
        throw new Error('Invalid permit ID format');
      }
      if (permitId) {
        const permit = await Permit.findById(permitId);
        if (!permit) {
          throw new Error('Permit ID does not exist');
        }
      }
      return true;
    })
    .withMessage('Invalid permit ID'),

  body('capacity').optional().isInt({ min: 10, max: 80 }).withMessage('Capacity must be between 10 and 80'),

  body('manufacturer').optional().isString().withMessage('Manufacturer must be a string'),

  body('yearOfManufacture')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Year of manufacture must be a valid year'),

  body('maintenanceHistory')
    .optional()
    .isArray()
    .withMessage('Maintenance history must be an array')
    .custom((history) => {
      if (history) {
        return history.every(
          (entry) =>
            entry.date &&
            typeof entry.date === 'string' &&
            typeof entry.description === 'string' &&
            typeof entry.cost === 'number'
        );
      }
      return true;
    })
    .withMessage('Invalid maintenance history format'),

  body('status')
    .optional()
    .isIn(['active', 'maintenance', 'retired'])
    .withMessage('Status must be one of "active", "maintenance", or "retired"'),

  body('routes')
    .optional()
    .isArray()
    .withMessage('Routes must be an array of route IDs')
    .custom(async (routes) => {
      if (routes) {
        const validRoutes = await Route.find({ _id: { $in: routes } });
        if (validRoutes.length !== routes.length) {
          throw new Error('One or more route IDs do not exist');
        }
      }
      return true;
    })
    .withMessage('Each route ID must be a valid ObjectId'),
];

exports.validateBusId = [
  body('busId')
    .notEmpty()
    .withMessage('Bus ID is required')
    .custom((busId) => {
      if (!mongoose.Types.ObjectId.isValid(busId)) {
        throw new Error('Invalid bus ID format');
      }
      return true;
    }),
];
