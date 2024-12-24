const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateTrip } = require('../validators/tripValidator');

router.use(authenticate);

router.post('/add', authorize('operator'), validateTrip, tripController.createTrip);
router.get('/', authorize('operator', 'commuter'), tripController.getAllTrips);

module.exports = router;
