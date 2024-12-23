const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRoute } = require('../validators/routeValidator');

router.use(authenticate);
router.post('/add', validateRoute, authorize('admin'), routeController.addRoute);
router.get('/', authorize('admin'), routeController.getAllRoutes);

module.exports = router;
