const express = require('express');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const routeRoutes = require('./routeRoutes');
const routeBuses = require('./busRoutes');
const routeTrips = require('./tripRoutes');
const routeBookings = require('./bookingRoutes');
const routePermit = require('./permitRoutes');
const routesSeatMaps = require('./seatMapRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/routes', routeRoutes);
router.use('/buses', routeBuses);
router.use('/trips', routeTrips);
router.use('/bookings', routeBookings);
router.use('/permit', routePermit);
router.use('/seat-maps', routesSeatMaps);

module.exports = router;
