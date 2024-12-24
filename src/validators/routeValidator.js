const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const mongoose = require('mongoose');
const User = require('../models/User');

exports.validateRoute = validate([
  body('origin')
    .trim()
    .notEmpty()
    .withMessage('Origin is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Origin must be between 2 and 100 characters'),

  body('destination')
    .trim()
    .notEmpty()
    .withMessage('Destination is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Destination must be between 2 and 100 characters'),

  body('schedule')
    .isArray()
    .withMessage('Schedule must be an array')
    .notEmpty()
    .withMessage('At least one schedule time is required')
    .custom((schedules) => {
      if (!Array.isArray(schedules)) {
        throw new Error('Schedule must be an array');
      }

      const invalidTimes = schedules.filter((time) => !/^(0?[1-9]|1[0-2]):00 (AM|PM)$/.test(time));

      if (invalidTimes.length > 0) {
        throw new Error(
          `Invalid time format: ${invalidTimes.join(', ')}. Time must be in format "HH:00 AM/PM" (e.g., "10:00 AM")`
        );
      }

      return true;
    }),

  body('operator')
    .notEmpty()
    .withMessage('Operator ID is required')
    .custom(async (operatorId) => {
      if (!mongoose.Types.ObjectId.isValid(operatorId)) {
        throw new Error('Invalid operator ID format');
      }

      const operator = await User.findOne({
        _id: operatorId,
        role: 'operator',
        active: true,
      });

      if (!operator) {
        throw new Error('Invalid operator or operator not found');
      }

      return true;
    }),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
]);
