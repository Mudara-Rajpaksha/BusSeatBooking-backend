const express = require('express');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const routeRoutes = require('./routeRoutes');
const routeBuses = require('./busRoutes');
const routeTrips = require('./tripRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/routes', routeRoutes);
router.use('/bus', routeBuses);
router.use('/trip', routeTrips);

module.exports = router;
