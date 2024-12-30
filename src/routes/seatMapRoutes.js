const express = require('express');
const router = express.Router();
const seatMapController = require('../controllers/seatMapController');
const { authenticate, authorize } = require('../middleware/auth');
const {
  validateCreateSeatMap,
  validateUpdateSeatMap,
  validateSeatMapId,
  validateSeatMapFilters,
} = require('../validators/seatMapValidator');

router.use(authenticate);
router.use(authorize('admin', 'operator'));

router.post('/add', validateCreateSeatMap, seatMapController.createSeatMap);
router.put('/:seatMapId', validateSeatMapId, validateUpdateSeatMap, seatMapController.updateSeatMap);
router.delete('/:seatMapId', validateSeatMapId, seatMapController.deleteSeatMap);
router.get('/:seatMapId', validateSeatMapId, seatMapController.getSeatMap);
router.get('/', validateSeatMapFilters, seatMapController.getAllSeatMaps);
router.get('/availability', seatMapController.getSeatAvailabilityMatrix);

module.exports = router;
