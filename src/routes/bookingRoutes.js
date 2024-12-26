const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateCreateBooking } = require('../validators/bookingValidator');

router.use(authenticate);

router.post('/add', authorize('commuter'), validateCreateBooking, bookingController.createBooking);
router.get('/my-bookings', authorize('commuter'), bookingController.getAllBookings);
router.get('/', authorize('operator'), bookingController.getAllBookings);
router.put('/:bookingId/cancel', authorize('commuter'), bookingController.cancelBooking);

module.exports = router;
