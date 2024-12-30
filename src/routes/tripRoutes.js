const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { authenticate, authorize } = require('../middleware/auth');
const {
  validateCreateTrip,
  validateUpdateTrip,
  validateDeleteTrip,
  validateGetTrip,
  validateCheckTripAvailability,
} = require('../validators/tripValidator');

router.use(authenticate);

router.use(authorize('admin', 'operator'));

router.post('/add', validateCreateTrip, tripController.createTrip);
router.put('/:tripId', validateUpdateTrip, tripController.updateTrip);
router.delete('/:tripId', validateDeleteTrip, tripController.deleteTrip);

router.use(authorize('admin', 'operator', 'commuter'));

router.get('/:tripId', validateGetTrip, tripController.getTrip);
router.get('/', tripController.getAllTrips);
router.get('/:tripId/availability', validateCheckTripAvailability, tripController.checkTripAvailability);

module.exports = router;
