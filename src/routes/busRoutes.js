const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const { authenticate, authorize } = require('../middleware/auth');
const {
  validateCreateBus,
  validateUpdateBus,
  validateBusId,
  validateBusFilters,
} = require('../validators/busValidator');

router.use(authenticate);
router.use(authorize('admin', 'operator'));

router.post('/add', validateCreateBus, busController.createBus);
router.get('/:busId', validateBusId, busController.getBus);
router.put('/:busId', validateUpdateBus, busController.updateBus);
router.delete('/:busId', validateBusId, busController.deleteBus);
router.get('/', validateBusFilters, busController.getAllBuses);

module.exports = router;
