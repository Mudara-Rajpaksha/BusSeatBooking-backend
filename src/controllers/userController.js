const userService = require('../services/userService');
const { ApiResponse } = require('../utils/responses');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers(req.query);
      res.json(new ApiResponse('Users retrieved successfully', users));
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json(new ApiResponse('User retrieved successfully', user));
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json(new ApiResponse('User updated successfully', user));
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
}

module.exports = new UserController();
