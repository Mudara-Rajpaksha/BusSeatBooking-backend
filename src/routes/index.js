const express = require('express');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const routeRoutes = require('./routeRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/routes', routeRoutes);

module.exports = router;
