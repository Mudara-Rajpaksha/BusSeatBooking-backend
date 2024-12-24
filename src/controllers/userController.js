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

  async getUsersByRole(req, res, next) {
    try {
      const { role } = req.params;
      const users = await userService.getUsersByRole(role);
      res.json(new ApiResponse('Users by role retrieved successfully', users));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
