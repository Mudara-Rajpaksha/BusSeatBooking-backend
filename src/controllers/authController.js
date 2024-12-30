const authService = require('../services/authService');
const tokenService = require('../services/tokenService');
const { ApiResponse, ApiError } = require('../utils/responses');
const config = require('../config/config');

class AuthController {
  async register(req, res, next) {
    try {
      const { firstname, lastname, email, mobile, username, password } = req.body;

      const user = await authService.register({ firstname, lastname, email, mobile, username, password });

      const tokens = tokenService.generateTokens({ id: user.id });
      await tokenService.saveToken(user.id, tokens.accessToken, tokens.refreshToken, req.headers['user-agent'], req.ip);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        maxAge: config.COOKIE_EXPIRES_IN,
        sameSite: 'strict',
      });

      res.status(201).json(
        new ApiResponse('Registration successful', {
          user,
          accessToken: tokens.accessToken,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      const user = await authService.login(username, password);

      const tokens = tokenService.generateTokens({ id: user.id });
      await tokenService.saveToken(user.id, tokens.accessToken, tokens.refreshToken, req.headers['user-agent'], req.ip);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        maxAge: config.COOKIE_EXPIRES_IN,
        sameSite: 'strict',
      });

      res.json(
        new ApiResponse('Login successful', {
          user,
          accessToken: tokens.accessToken,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.signedCookies;

      if (!refreshToken) {
        throw new ApiError('Refresh token not found', 401);
      }

      const { payload, tokenDoc } = await tokenService.validateRefreshToken(refreshToken);
      const user = await authService.getProfile(payload.id);

      const tokens = tokenService.generateTokens({ id: user.id });

      await tokenDoc.updateOne({ isValid: false });
      await tokenService.saveToken(user.id, tokens.accessToken, tokens.refreshToken, req.headers['user-agent'], req.ip);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        maxAge: config.COOKIE_EXPIRES_IN,
        sameSite: 'strict',
      });

      res.json(
        new ApiResponse('Token refreshed successfully', {
          accessToken: tokens.accessToken,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.signedCookies;
      if (refreshToken) {
        await authService.logout(req.user.id, refreshToken);
      }

      res.clearCookie('refreshToken');
      res.json(new ApiResponse('Logged out successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      res.json(new ApiResponse('Profile retrieved successfully', { user }));
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req, res, next) {
    try {
      const loggedInUserId = req.user._id;
      const userIdToUpdate = req.params.id;

      if (loggedInUserId.toString() !== userIdToUpdate) {
        throw new ApiError('You can only update your own account', 403);
      }

      const user = await authService.updateMe(userIdToUpdate, req.body);
      res.json(new ApiResponse('User updated successfully', { user }));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
