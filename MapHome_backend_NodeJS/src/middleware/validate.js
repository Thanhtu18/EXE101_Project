const { validationResult } = require("express-validator");

/**
 * Middleware to check for validation errors
 * If errors exist, returns a 400 Bad Request with the errors array
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = validate;
