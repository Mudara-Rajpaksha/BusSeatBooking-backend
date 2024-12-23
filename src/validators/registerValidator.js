const { body, validationResult } = require('express-validator');
const { validate } = require('../middleware/validator');

exports.validateRegister = validate([
  body('username')
    .trim()
    .notEmpty()
    .withMessage('username is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('username must be between 2 and 50 characters'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
]);

exports.validateLogin = validate([
  body('username').trim().notEmpty().withMessage('Please provide a username'),
  body('password').notEmpty().withMessage('Password is required'),
]);

exports.validatePassword = validate([
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
]);
