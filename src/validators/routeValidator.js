const { body } = require('express-validator');
const { validate } = require('../middleware/validator');

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

  body('schedule').trim().notEmpty().withMessage('Schedule is required'),

  body('operator')
    .trim()
    .notEmpty()
    .withMessage('Operator is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Operator must be between 2 and 100 characters'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
]);
