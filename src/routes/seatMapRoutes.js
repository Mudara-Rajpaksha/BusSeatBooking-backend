const express = require('express');
const router = express.Router();
const seatMapController = require('../controllers/seatMapController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/add', seatMapController.createSeatMap);

router.put('/:seatMapId', seatMapController.updateSeatMap);

router.delete('/:seatMapId', seatMapController.deleteSeatMap);

router.get('/:seatMapId', seatMapController.getSeatMap);

router.get('/', seatMapController.getAllSeatMaps);

router.get('/:busId/availability', seatMapController.getSeatAvailabilityMatrix);

module.exports = router;
