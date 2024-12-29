const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/available-trips', bookingController.findAvailableTrips);

router.get('/:tripId/seat-availability', bookingController.getSeatAvailability);

router.post('/create', bookingController.createBooking);

module.exports = router;
