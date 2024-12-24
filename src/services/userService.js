const User = require('../models/User');
const { ApiError } = require('../utils/responses');

class UserService {
  async getAllUsers(filters = {}, options = {}) {
    const query = User.find(filters);

    if (options.sort) {
      query.sort(options.sort);
    }

    if (options.select) {
      query.select(options.select);
    }

    if (options.limit) {
      query.limit(parseInt(options.limit));
    }

    if (options.skip) {
      query.skip(parseInt(options.skip));
    }

    return await query.exec();
  }

  async getUsersByRole(role) {
    if (!role) {
      throw new ApiError('Role is required', 400);
    }

    const query = User.find({ role });

    return await query.exec();
  }
}

module.exports = new UserService();
