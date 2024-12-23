const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/config');
const Token = require('../models/Token');
const { ApiError } = require('../utils/responses');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  async saveToken(userId, accessToken, refreshToken, userAgent, ipAddress) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await Token.updateMany(
      {
        userId,
        userAgent,
        ipAddress,
        isValid: true,
      },
      { isValid: false }
    );

    return await Token.create({
      userId,
      accessToken,
      refreshToken,
      userAgent,
      ipAddress,
      expiresAt,
    });
  }

  async validateAccessToken(accessToken) {
    try {
      const payload = jwt.verify(accessToken, config.JWT_ACCESS_SECRET);
      const tokenDoc = await Token.findOne({
        accessToken,
        isValid: true,
        expiresAt: { $gt: new Date() },
      });

      if (!tokenDoc) {
        throw new ApiError('Invalid access token', 401);
      }

      await tokenDoc.updateOne({ lastUsed: new Date() });

      return payload;
    } catch (error) {
      throw new ApiError(error.name === 'TokenExpiredError' ? 'Access token expired' : 'Invalid access token', 401);
    }
  }

  async validateRefreshToken(refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
      const tokenDoc = await Token.findOne({
        refreshToken,
        isValid: true,
        expiresAt: { $gt: new Date() },
      });

      if (!tokenDoc) {
        throw new ApiError('Invalid refresh token', 401);
      }

      return { payload, tokenDoc };
    } catch (error) {
      throw new ApiError(error.name === 'TokenExpiredError' ? 'Refresh token expired' : 'Invalid refresh token', 401);
    }
  }

  async revokeToken(tokenId) {
    const token = await Token.findByIdAndUpdate(tokenId, { isValid: false }, { new: true });

    if (!token) {
      throw new ApiError('Token not found', 404);
    }

    return token;
  }

  async cleanupExpiredTokens() {
    return await Token.deleteMany({
      $or: [{ expiresAt: { $lte: new Date() } }, { isValid: false }],
    });
  }
}

module.exports = new TokenService();
