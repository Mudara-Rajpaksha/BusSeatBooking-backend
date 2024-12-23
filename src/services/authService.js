const User = require('../models/User');
const Token = require('../models/Token');
const tokenService = require('./tokenService');
const { ApiError } = require('../utils/responses');

class AuthService {
  async register(userData) {
    const existingUser = await User.findOne({ username: userData.username });

    if (existingUser) {
      throw new ApiError('Username already registered', 400);
    }

    const user = await User.create({
      username: userData.username,
      password: userData.password,
    });

    return {
      id: user._id,
      username: user.username,
      role: user.role,
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError('Invalid credentials', 401);
    }

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async logout(userId, refreshToken) {
    await Token.findOneAndUpdate({ userId, refreshToken, isValid: true }, { isValid: false });
  }

  async logoutAll(userId) {
    await Token.updateMany({ userId, isValid: true }, { isValid: false });
  }

  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    const allowedUpdates = ['name', 'email'];
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

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    if (!(await user.comparePassword(currentPassword))) {
      throw new ApiError('Current password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    await this.logoutAll(userId);
  }

  async deleteAccount(userId, password) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    if (!(await user.comparePassword(password))) {
      throw new ApiError('Password is incorrect', 401);
    }

    user.active = false;
    await user.save({ validateBeforeSave: false });

    await this.logoutAll(userId);
  }
}

module.exports = new AuthService();
