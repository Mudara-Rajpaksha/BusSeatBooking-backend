const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/add', tripController.createTrip);

router.put('/:tripId', tripController.updateTrip);

router.delete('/:tripId', tripController.deleteTrip);

router.get('/:tripId', tripController.getTrip);

router.get('/', tripController.getAllTrips);

router.get('/:tripId/availability', tripController.checkTripAvailability);

module.exports = router;
