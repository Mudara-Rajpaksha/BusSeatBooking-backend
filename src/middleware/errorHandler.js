const config = require('../config/config');
const logger = require('../utils/logger');
const { ApiError } = require('../utils/responses');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
  });

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(config.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: Object.values(err.errors)
        .map((e) => e.message)
        .join(', '),
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      status: 'error',
      message: `${field} already exists`,
    });
  }

  res.status(err.statusCode).json({
    status: 'error',
    message: config.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    ...(config.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
