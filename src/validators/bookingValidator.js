const { body, query, param, validationResult } = require('express-validator');
const { validate } = require('../middleware/validator');

exports.validateFindAvailableTrips = validate([
  query('fromStop')
    .trim()
    .notEmpty()
    .withMessage('From stop is required')
    .isString()
    .withMessage('From stop must be a string'),

  query('toStop')
    .trim()
    .notEmpty()
    .withMessage('To stop is required')
    .isString()
    .withMessage('To stop must be a string'),

  query('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Please provide a valid date in ISO 8601 format'),
]);

exports.validateSeatAvailability = validate([
  param('tripId').isMongoId().withMessage('Invalid trip ID format'),

  query('fromStop')
    .trim()
    .notEmpty()
    .withMessage('From stop is required')
    .isString()
    .withMessage('From stop must be a string'),

  query('toStop')
    .trim()
    .notEmpty()
    .withMessage('To stop is required')
    .isString()
    .withMessage('To stop must be a string'),
]);

exports.validateCreateBooking = validate([
  body('tripId').isMongoId().withMessage('Invalid trip ID format'),

  body('userId').isMongoId().withMessage('Invalid user ID format'),

  body('seatIds')
    .isArray({ min: 1 })
    .withMessage('At least one seat must be selected')
    .custom((seatIds) => seatIds.every((id) => typeof id === 'string'))
    .withMessage('All seat IDs must be strings'),

  body('fromStop')
    .trim()
    .notEmpty()
    .withMessage('From stop is required')
    .isString()
    .withMessage('From stop must be a string'),

  body('toStop')
    .trim()
    .notEmpty()
    .withMessage('To stop is required')
    .isString()
    .withMessage('To stop must be a string'),

  body('paymentDetails')
    .optional()
    .isObject()
    .withMessage('Payment details must be an object')
    .custom((value, { req }) => {
      if (value) {
        if (!value.paymentMethod) {
          throw new Error('Payment method is required when payment details are provided');
        }
        if (typeof value.amountPaid !== 'number') {
          throw new Error('Amount paid must be a number');
        }
      }
      return true;
    }),
]);

exports.validateUpdateBooking = validate([
  param('bookingId').isMongoId().withMessage('Invalid booking ID format'),

  body('seatIds')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one seat must be selected')
    .custom((seatIds) => seatIds.every((id) => typeof id === 'string'))
    .withMessage('All seat IDs must be strings'),

  body('fromStop')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('From stop cannot be empty if provided')
    .isString()
    .withMessage('From stop must be a string'),

  body('toStop')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('To stop cannot be empty if provided')
    .isString()
    .withMessage('To stop must be a string'),

  body('paymentDetails')
    .optional()
    .isObject()
    .withMessage('Payment details must be an object')
    .custom((value) => {
      if (value) {
        if (!value.paymentMethod) {
          throw new Error('Payment method is required when payment details are provided');
        }
        if (typeof value.amountPaid !== 'number') {
          throw new Error('Amount paid must be a number');
        }
      }
      return true;
    }),
]);

exports.validateCancelBooking = validate([param('bookingId').isMongoId().withMessage('Invalid booking ID format')]);

exports.validateGetBookingDetails = validate([param('bookingId').isMongoId().withMessage('Invalid booking ID format')]);

exports.validateGetUserBookings = validate([
  query('userId').isMongoId().withMessage('Invalid user ID format'),

  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'expired'])
    .withMessage('Invalid booking status'),
]);
