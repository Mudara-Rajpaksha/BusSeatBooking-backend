const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Token = require('../models/Token');
const { ApiError } = require('../utils/responses');
const USER_ROLE = require('../enums/userRoles');

class AuthService {
  async register(userData) {
    const existingUser = await User.findOne({ username: userData.username });

    if (existingUser) {
      throw new ApiError('Username already registered', 400);
    }

    const user = await User.create({
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      mobile: userData.mobile,
      username: userData.username,
      password: userData.password,
      role: USER_ROLE.COMMUTER,
    });

    return {
      id: user._id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    };
  }

  async login(username, password) {
    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError('Invalid credentials', 401);
    }

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    return {
      id: user._id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    };
  }

  async logout(userId, refreshToken) {
    await Token.findOneAndUpdate({ userId, refreshToken, isValid: true }, { isValid: false });
  }

  async getProfile(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    return {
      id: user._id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      verified: user.verified,
    };
  }

  async updateMe(userId, updateData) {
    if (updateData.password) {
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) throw new ApiError('User not found', 404);

    return user;
  }
}

module.exports = new AuthService();
