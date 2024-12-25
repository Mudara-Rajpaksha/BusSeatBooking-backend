const { body, query } = require('express-validator');
const { validate } = require('../middleware/validator');
const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const Bus = require('../models/Bus');

exports.validateCreateBooking = validate([
  body('tripId')
    .notEmpty()
    .withMessage('Trip ID is required')
    .custom(async (tripId) => {
      if (!mongoose.Types.ObjectId.isValid(tripId)) {
        throw new Error('Invalid trip ID format');
      }

      const trip = await Trip.findOne({
        _id: tripId,
        status: 'SCHEDULED',
      });

      if (!trip) {
        throw new Error('Trip not found or not available for booking');
      }

      return true;
    }),

  body('seatNumber')
    .notEmpty()
    .withMessage('Seat number is required')
    .custom(async (seatNumber, { req }) => {
      const trip = await Trip.findById(req.body.tripId).populate('bus');

      if (!trip) {
        throw new Error('Trip not found');
      }

      const seatExists = trip.bus.seats.some((seat) => seat.seatNumber === seatNumber);

      if (!seatExists) {
        throw new Error('Invalid seat number');
      }

      const isSeatBooked = trip.bus.seats.some((seat) => seat.seatNumber === seatNumber && seat.isBooked);

      if (isSeatBooked) {
        throw new Error('Seat is already booked');
      }

      return true;
    }),
]);
