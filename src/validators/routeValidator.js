const { body, query } = require('express-validator');
const { validate } = require('../middleware/validator');

exports.validateCreateRoute = validate([
  body('routeNumber')
    .trim()
    .notEmpty()
    .withMessage('Route number is required')
    .isLength({ max: 50 })
    .withMessage('Route number must be less than 50 characters'),

  body('startLocation')
    .trim()
    .notEmpty()
    .withMessage('Start location is required')
    .isLength({ max: 100 })
    .withMessage('Start location must be less than 100 characters'),

  body('endLocation')
    .trim()
    .notEmpty()
    .withMessage('End location is required')
    .isLength({ max: 100 })
    .withMessage('End location must be less than 100 characters'),

  body('distance')
    .isNumeric()
    .withMessage('Distance must be a valid number')
    .isInt({ min: 1 })
    .withMessage('Distance must be greater than 0'),

  body('fare')
    .isNumeric()
    .withMessage('Fare must be a valid number')
    .isInt({ min: 1 })
    .withMessage('Fare must be greater than 0'),

  body('schedules')
    .isArray()
    .withMessage('Schedules must be an array')
    .optional()
    .custom((value) => {
      if (value) {
        value.forEach((schedule) => {
          if (!schedule.departureTime || !schedule.arrivalTime) {
            throw new Error('Each schedule must have departureTime and arrivalTime');
          }
          if (schedule.frequency && schedule.frequency < 1) {
            throw new Error('Frequency must be greater than 0');
          }
        });
      }
      return true;
    }),
  body('stops')
    .isArray()
    .withMessage('Stops must be an array')
    .optional()
    .custom((value) => {
      if (value) {
        value.forEach((stop) => {
          if (!stop.name || !stop.distance || !stop.timeFromStart) {
            throw new Error('Each stop must have name, distance, and timeFromStart');
          }
        });
      }
      return true;
    }),
]);

exports.validateUpdateRoute = validate([
  body('routeNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Route number must be less than 50 characters'),

  body('startLocation')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Start location must be less than 100 characters'),

  body('endLocation')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('End location must be less than 100 characters'),

  body('distance')
    .optional()
    .isNumeric()
    .withMessage('Distance must be a valid number')
    .isInt({ min: 1 })
    .withMessage('Distance must be greater than 0'),

  body('fare')
    .optional()
    .isNumeric()
    .withMessage('Fare must be a valid number')
    .isInt({ min: 1 })
    .withMessage('Fare must be greater than 0'),

  body('schedules')
    .optional()
    .isArray()
    .withMessage('Schedules must be an array')
    .custom((value) => {
      if (value) {
        value.forEach((schedule) => {
          if (!schedule.departureTime || !schedule.arrivalTime) {
            throw new Error('Each schedule must have departureTime and arrivalTime');
          }
        });
      }
      return true;
    }),
  body('stops')
    .optional()
    .isArray()
    .withMessage('Stops must be an array')
    .custom((value) => {
      if (value) {
        value.forEach((stop) => {
          if (!stop.name || !stop.distance || !stop.timeFromStart) {
            throw new Error('Each stop must have name, distance, and timeFromStart');
          }
        });
      }
      return true;
    }),
]);

exports.validateRouteFilters = validate([
  query('status')
    .optional()
    .isIn(['active', 'suspended', 'cancelled'])
    .withMessage('Status must be one of active, suspended, or cancelled'),

  query('routeNumber').optional().isLength({ max: 50 }).withMessage('Route number must be less than 50 characters'),

  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),

  query('sort')
    .optional()
    .isIn(['routeNumber', '-routeNumber'])
    .withMessage('Sort must be either routeNumber or -routeNumber'),
]);
