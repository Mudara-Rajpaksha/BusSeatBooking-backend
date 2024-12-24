const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRoute } = require('../validators/routeValidator');

router.use(authenticate);
router.use(authorize('admin'));

router.post('/add', validateRoute, routeController.addRoute);
router.get('/', routeController.getAllRoutes);

module.exports = router;
