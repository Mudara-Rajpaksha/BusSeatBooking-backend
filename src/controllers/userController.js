const USER_ROLE = require('../enums/userRoles');
const userService = require('../services/userService');
const { ApiResponse } = require('../utils/responses');

class UserController {
  async createUser(req, res, next) {
    try {
      const userData = {
        ...req.body,
        role: req.body.role || USER_ROLE.COMMUTER,
      };

      const user = await userService.createUser(userData, req.user);

      res.status(201).json(
        new ApiResponse(`${userData.role} account created successfully`, {
          user,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async listUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers(req.query);
      res.json(new ApiResponse('Users retrieved successfully', { users }));
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json(new ApiResponse('User updated successfully', { user }));
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const userId = req.params.id;

      const result = await userService.resetPassword(userId);
      res.json(new ApiResponse(result.message));
    } catch (error) {
      next(error);
    }
  }

  async hardDeleteUser(req, res, next) {
    try {
      const userId = req.params.id;

      const result = await userService.hardDeleteUser(userId);
      res.json(new ApiResponse(result.message));
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id);
      res.json(new ApiResponse('User deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getUsersByRole(req, res, next) {
    try {
      const { role } = req.params;
      const users = await userService.getUsersByRole(role);
      res.json(new ApiResponse('Users retrieved successfully', { users }));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
