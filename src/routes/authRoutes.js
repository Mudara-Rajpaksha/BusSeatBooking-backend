const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { rateLimiter } = require('../middleware/rateLimiter');
const { validateRegister, validateLogin } = require('../validators/registerValidator');

router.post('/register', rateLimiter, validateRegister, authController.register);
router.post('/login', rateLimiter, validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);

router.use(authenticate);
router.get('/me', authController.getProfile);
router.put('/updateMe/:id', authController.updateMe);
router.post('/logout', authController.logout);

module.exports = router;
