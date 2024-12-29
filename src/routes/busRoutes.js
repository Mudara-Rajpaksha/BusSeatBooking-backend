const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateCreateBus, validateUpdateBus, validateBusId } = require('../validators/busValidator');

router.post('/add', validateCreateBus, busController.createBus);
router.get('/:busId', validateBusId, busController.getBus);
router.put('/:busId', validateUpdateBus, busController.updateBus);
router.delete('/:busId', validateBusId, busController.deleteBus);
router.get('/', busController.getAllBuses);

module.exports = router;
