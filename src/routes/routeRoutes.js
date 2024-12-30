const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateCreateRoute, validateUpdateRoute, validateRouteFilters } = require('../validators/routeValidator');

router.use(authenticate);
router.use(authorize('admin', 'operator'));

router.post('/add', validateCreateRoute, routeController.createRoute);
router.put('/:routeId', validateUpdateRoute, routeController.updateRoute);
router.delete('/:routeId', routeController.deleteRoute);
router.get('/:routeId', routeController.getRoute);
router.get('/', validateRouteFilters, routeController.getAllRoutes);

module.exports = router;
