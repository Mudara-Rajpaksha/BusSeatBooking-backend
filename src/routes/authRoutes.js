const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateRegister, validateLogin, validatePassword } = require('../middleware/validator');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);

router.use(authenticate);
router.post('/logout', authController.logout);
router.post('/logout-all', authController.logoutAll);
router.get('/profile', authController.getProfile);
router.patch('/profile', authController.updateProfile);
router.post('/change-password', validatePassword, authController.changePassword);
router.delete('/delete-account', authController.deleteAccount);

module.exports = router;
