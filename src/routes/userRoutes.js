const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('admin'));

router.route('/').get(userController.getAllUsers);

router.get('/role/:role', userController.getUsersByRole);

module.exports = router;
