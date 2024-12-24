const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateCreateBooking } = require('../validators/bookingValidator');

router.use(authenticate);

router.post('/add', authorize('commuter'), validateCreateBooking, bookingController.createBooking);
router.get('/', authorize('operator'), bookingController.getAllBookings);
router.put('/:bookingId/cancel', authorize('operator'), bookingController.cancelBooking);

module.exports = router;
