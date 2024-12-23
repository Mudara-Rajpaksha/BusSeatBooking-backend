class ApiResponse {
  constructor(message, data = null, metadata = null) {
    this.status = 'success';
    this.message = message;
    if (data) this.data = data;
    if (metadata) this.metadata = metadata;
  }
}

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  ApiResponse,
  ApiError,
};
