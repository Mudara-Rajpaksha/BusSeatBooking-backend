const express = require('express');
const router = express.Router();
const permitController = require('../controllers/permitController');
const { authenticate, authorize } = require('../middleware/auth');
const {
  validateCreatePermit,
  validateUpdatePermit,
  validatePermitFilters,
  validatePermitId,
} = require('../validators/permitValidator');

router.use(authenticate);
router.use(authorize('admin', 'operator'));

router.post('/add', validateCreatePermit, permitController.createPermit);
router.put('/:permitId', validatePermitId, validateUpdatePermit, permitController.updatePermit);
router.get('/:permitId', validatePermitId, permitController.getPermit);
router.get('/', validatePermitFilters, permitController.getAllPermits);
router.delete('/:permitId', validatePermitId, permitController.deletePermit);

module.exports = router;
