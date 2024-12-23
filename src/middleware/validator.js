const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/responses');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => err.msg);
    next(new ApiError(extractedErrors[0], 400));
  };
};

module.exports = { validate };
