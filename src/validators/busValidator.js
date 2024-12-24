const { body } = require('express-validator');
const { validate } = require('../middleware/validator');

exports.validateBus = validate([
  body('registrationNumber')
    .trim()
    .notEmpty()
    .withMessage('Registration number is required')
    .isLength({ min: 5, max: 20 })
    .withMessage('Registration number must be between 5 and 20 characters')
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage('Registration number must be alphanumeric'),

  body('seats')
    .optional()
    .isArray()
    .withMessage('Seats must be an array')
    .custom((seats) => {
      if (seats) {
        return seats.every(
          (seat) =>
            typeof seat.seatNumber === 'string' &&
            seat.seatNumber.match(/^[A-Z][0-9]$/) &&
            typeof seat.isBooked === 'boolean'
        );
      }
      return true;
    })
    .withMessage('Invalid seat format. Each seat must have a valid seatNumber (e.g., A1, B2) and isBooked status'),

  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array of strings')
    .custom((value) => value.every((item) => typeof item === 'string'))
    .withMessage('Each amenity must be a string'),

  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean value'),
]);
