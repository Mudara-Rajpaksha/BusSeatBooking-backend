const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/add', routeController.createRoute);

router.put('/:routeId', routeController.updateRoute);

router.delete('/:routeId', routeController.deleteRoute);

router.get('/:routeId', routeController.getRoute);

router.get('/', routeController.getAllRoutes);

module.exports = router;
