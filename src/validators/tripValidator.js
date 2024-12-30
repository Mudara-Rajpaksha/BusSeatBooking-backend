const { body, query, param } = require('express-validator');
const { validate } = require('../middleware/validator');
const mongoose = require('mongoose');

exports.validateCreateTrip = validate([
  body('routeId')
    .notEmpty()
    .withMessage('Route ID is required')
    .custom((routeId) => {
      if (!mongoose.Types.ObjectId.isValid(routeId)) {
        throw new Error('Invalid route ID format');
      }
      return true;
    }),

  body('busId')
    .notEmpty()
    .withMessage('Bus ID is required')
    .custom((busId) => {
      if (!mongoose.Types.ObjectId.isValid(busId)) {
        throw new Error('Invalid bus ID format');
      }
      return true;
    }),

  body('departureDate')
    .notEmpty()
    .withMessage('Departure date is required')
    .isISO8601()
    .withMessage('Invalid departure date format'),

  body('arrivalDate')
    .notEmpty()
    .withMessage('Arrival date is required')
    .isISO8601()
    .withMessage('Invalid arrival date format'),

  body('status')
    .optional()
    .isIn(['scheduled', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Invalid trip status'),

  body('intermediateStops')
    .optional()
    .isArray()
    .withMessage('Intermediate stops must be an array')
    .custom((stops) => {
      stops.forEach((stop) => {
        if (!stop.stopName || !stop.arrivalTime || !stop.departureTime || !stop.fareFromStart) {
          throw new Error('Each stop must have stopName, arrivalTime, departureTime, and fareFromStart');
        }
      });
      return true;
    }),
]);

exports.validateUpdateTrip = validate([
  param('tripId')
    .notEmpty()
    .withMessage('Trip ID is required')
    .custom((tripId) => {
      if (!mongoose.Types.ObjectId.isValid(tripId)) {
        throw new Error('Invalid trip ID format');
      }
      return true;
    }),

  body('routeId')
    .optional()
    .custom((routeId) => {
      if (routeId && !mongoose.Types.ObjectId.isValid(routeId)) {
        throw new Error('Invalid route ID format');
      }
      return true;
    }),

  body('busId')
    .optional()
    .custom((busId) => {
      if (busId && !mongoose.Types.ObjectId.isValid(busId)) {
        throw new Error('Invalid bus ID format');
      }
      return true;
    }),

  body('departureDate').optional().isISO8601().withMessage('Invalid departure date format'),

  body('arrivalDate').optional().isISO8601().withMessage('Invalid arrival date format'),

  body('availableSeats').optional().isInt({ min: 1 }).withMessage('Available seats must be a positive integer'),

  body('status')
    .optional()
    .isIn(['scheduled', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Invalid trip status'),

  body('paymentRequired').optional().isBoolean().withMessage('Payment required must be a boolean value'),

  body('intermediateStops')
    .optional()
    .isArray()
    .withMessage('Intermediate stops must be an array')
    .custom((stops) => {
      stops.forEach((stop) => {
        if (!stop.stopName || !stop.arrivalTime || !stop.departureTime || !stop.fareFromStart) {
          throw new Error('Each stop must have stopName, arrivalTime, departureTime, and fareFromStart');
        }
      });
      return true;
    }),
]);

exports.validateDeleteTrip = validate([
  param('tripId')
    .notEmpty()
    .withMessage('Trip ID is required')
    .custom((tripId) => {
      if (!mongoose.Types.ObjectId.isValid(tripId)) {
        throw new Error('Invalid trip ID format');
      }
      return true;
    }),
]);

exports.validateGetTrip = validate([
  param('tripId')
    .notEmpty()
    .withMessage('Trip ID is required')
    .custom((tripId) => {
      if (!mongoose.Types.ObjectId.isValid(tripId)) {
        throw new Error('Invalid trip ID format');
      }
      return true;
    }),
]);

exports.validateCheckTripAvailability = validate([
  param('tripId')
    .notEmpty()
    .withMessage('Trip ID is required')
    .custom((tripId) => {
      if (!mongoose.Types.ObjectId.isValid(tripId)) {
        throw new Error('Invalid trip ID format');
      }
      return true;
    }),

  query('fromStop').notEmpty().withMessage('From stop is required'),

  query('toStop').notEmpty().withMessage('To stop is required'),

  query('seatCount')
    .notEmpty()
    .withMessage('Seat count is required')
    .isInt({ min: 1 })
    .withMessage('Seat count must be a positive integer'),
]);
