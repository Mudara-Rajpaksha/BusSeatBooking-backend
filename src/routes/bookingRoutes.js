const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');
const {
  validateFindAvailableTrips,
  validateSeatAvailability,
  validateCreateBooking,
  validateUpdateBooking,
  validateCancelBooking,
  validateGetBookingDetails,
  validateGetUserBookings,
} = require('../validators/bookingValidator');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('admin', 'operator', 'commuter'));

router.get('/available-trips', validateFindAvailableTrips, BookingController.findAvailableTrips);
router.get('/:tripId/seat-availability', validateSeatAvailability, BookingController.getSeatAvailability);
router.post('/create', validateCreateBooking, BookingController.createBooking);
router.put('/:bookingId', validateUpdateBooking, BookingController.updateBooking);
router.delete('/:bookingId/cancel', validateCancelBooking, BookingController.cancelBooking);
router.get('/:bookingId', validateGetBookingDetails, BookingController.getBookingDetails);
router.get('/user-bookings', validateGetUserBookings, BookingController.getUserBookings);

module.exports = router;
