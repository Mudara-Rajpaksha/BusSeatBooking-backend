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
      role: userData.role,
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
}

module.exports = new AuthService();
