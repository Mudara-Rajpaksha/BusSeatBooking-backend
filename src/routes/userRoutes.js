const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('admin'));

router.post('/create', userController.createUser);
router.get('/', userController.listUsers);
router.get('/:role', userController.getUsersByRole);
router.put('/:id', userController.updateUser);
router.patch('/reset-password/:id', userController.resetPassword);
router.delete('/:id', userController.deleteUser);
router.delete('/remove/:id', userController.hardDeleteUser);

module.exports = router;
