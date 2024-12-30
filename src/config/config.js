require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',

  COOKIE_SECRET: process.env.COOKIE_SECRET,
  COOKIE_EXPIRES_IN: 7 * 24 * 60 * 60 * 1000,

  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
  RATE_LIMIT_MAX: 100,

  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  PASSWORD_SALT_ROUNDS: 12,

  SWAGGER_USER: process.env.SWAGGER_USER,
  SWAGGER_PASSWORD: process.env.SWAGGER_PASSWORD,
};
