const { body, param } = require("express-validator");

const createReviewRules = [
  body("propertyId")
    .notEmpty().withMessage("Property ID is required")
    .isMongoId().withMessage("Invalid Property ID format"),
    
  body("rating")
    .notEmpty().withMessage("Rating is required")
    .isInt({ min: 1, max: 5 }).withMessage("Rating must be an integer between 1 and 5"),
    
  body("comment")
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage("Comment cannot exceed 1000 characters"),
];

const updateReviewRules = [
  param("id")
    .isMongoId().withMessage("Invalid Review ID format"),
    
  body("rating").optional().isInt({ min: 1, max: 5 }),
  body("comment").optional().trim().isLength({ max: 1000 }),
];

const replyToReviewRules = [
  param("id")
    .isMongoId().withMessage("Invalid Review ID format"),
    
  body("reply")
    .notEmpty().withMessage("Reply content is required")
    .trim()
    .isLength({ max: 1000 }).withMessage("Reply cannot exceed 1000 characters"),
];

module.exports = {
  createReviewRules,
  updateReviewRules,
  replyToReviewRules,
};
