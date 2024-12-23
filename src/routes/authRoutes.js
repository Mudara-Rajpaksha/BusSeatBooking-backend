const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateRegister, validateLogin } = require('../validators/registerValidator');

router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);

router.use(authenticate);
router.post('/logout', authController.logout);

module.exports = router;
