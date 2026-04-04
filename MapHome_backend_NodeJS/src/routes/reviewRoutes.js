const express = require("express");
const router = express.Router();
const {
  getPropertyReviews,
  createReview,
  updateReview,
  deleteReview,
  replyToReview,
  getLatestReviews,
} = require("../controllers/reviewController");
const { createReviewRules, updateReviewRules, replyToReviewRules } = require("../validators/reviewValidator");
const validate = require("../middleware/validate");
const { authMiddleware, requireAnyRole } = require("../middleware/authMiddleware");


router.get("/latest", getLatestReviews);
router.get("/property/:propertyId", getPropertyReviews);
router.post("/", authMiddleware, createReviewRules, validate, createReview);

router.put("/:id", authMiddleware, updateReviewRules, validate, updateReview);

router.delete("/:id", authMiddleware, deleteReview);
router.put("/:id/reply", authMiddleware, requireAnyRole(["landlord", "admin"]), replyToReviewRules, validate, replyToReview);


module.exports = router;
