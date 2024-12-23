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

  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return user;
  }

  async updateUser(userId, updateData) {
    const allowedUpdates = ['name', 'email', 'role'];
    const updates = Object.keys(updateData)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    return user;
  }

  async deleteUser(userId) {
    const user = await User.findByIdAndUpdate(userId, { active: false }, { new: true });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    return user;
  }
}

module.exports = new UserService();
