const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBus } = require('../validators/busValidator');

router.use(authenticate);
router.post('/add', validateBus, authorize('operator'), busController.addBus);
router.get('/', authorize('operator'), busController.getAllBuses);

module.exports = router;
