const express = require('express');
const router = express.Router();
const permitController = require('../controllers/permitController');
const { authenticate, authorize } = require('../middleware/auth');
const { validatePermitId } = require('../validators/permitValidator');

router.post('/add', permitController.createPermit);
router.put('/:permitId', validatePermitId, permitController.updatePermit);
router.get('/:permitId', validatePermitId, permitController.getPermit);
router.get('/', permitController.getAllPermits);
router.delete('/:permitId', permitController.deletePermit);

module.exports = router;
