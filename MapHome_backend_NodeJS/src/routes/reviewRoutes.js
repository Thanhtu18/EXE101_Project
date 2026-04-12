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


/**
 * @swagger
 * /api/reviews/latest:
 *   get:
 *     summary: Get latest reviews across all properties
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of latest reviews
 */
router.get("/latest", getLatestReviews);

/**
 * @swagger
 * /api/reviews/property/{propertyId}:
 *   get:
 *     summary: Get reviews for a specific property
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of reviews for the property
 */
router.get("/property/:propertyId", getPropertyReviews);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [propertyId, rating, comment]
 *     responses:
 *       201:
 *         description: Review created
 */
router.post("/", authMiddleware, createReviewRules, validate, createReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update an existing review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review updated
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review removed
 */
router.put("/:id", authMiddleware, updateReviewRules, validate, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

/**
 * @swagger
 * /api/reviews/{id}/reply:
 *   put:
 *     summary: Landlord or Admin can reply to a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reply]
 *     responses:
 *       200:
 *         description: Reply added to review
 */
router.put("/:id/reply", authMiddleware, requireAnyRole(["landlord", "admin"]), replyToReviewRules, validate, replyToReview);


module.exports = router;
