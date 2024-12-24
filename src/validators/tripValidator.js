const { body } = require('express-validator');
const { validate } = require('../middleware/validator');

exports.validateTrip = validate([
  body('route').notEmpty().withMessage('Route is required').isMongoId().withMessage('Invalid route ID format'),

  body('bus').notEmpty().withMessage('Bus is required').isMongoId().withMessage('Invalid bus ID format'),
]);
