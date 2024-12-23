const tokenService = require('../services/tokenService');
const User = require('../models/User');
const { ApiError } = require('../utils/responses');

exports.authenticate = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      throw new ApiError('No access token provided', 401);
    }

    const payload = await tokenService.validateAccessToken(accessToken);
    const user = await User.findById(payload.id);

    if (!user) {
      throw new ApiError('User not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError('Not authorized to access this route', 403));
    }
    next();
  };
};
