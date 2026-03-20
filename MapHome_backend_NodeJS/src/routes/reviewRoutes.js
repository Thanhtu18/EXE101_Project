const express = require("express");
const router = express.Router();
const {
  getPropertyReviews,
  createReview,
  updateReview,
  deleteReview,
  replyToReview,
} = require("../controllers/reviewController");
const { authMiddleware, requireAnyRole } = require("../middleware/authMiddleware");

router.get("/property/:propertyId", getPropertyReviews);
router.post("/", authMiddleware, createReview);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);
router.put("/:id/reply", authMiddleware, requireAnyRole(["landlord", "admin"]), replyToReview);

module.exports = router;
