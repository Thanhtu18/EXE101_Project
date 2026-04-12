const express = require("express");
const router = express.Router();
const {
  getVerifications,
  getVerificationById,
  createVerification,
  updateVerification,
  deleteVerification,
  notifyUserAboutPhotos,
  submitUserPhotos,
  completeInspection,
  getVerificationPricing,
} = require("../controllers/verificationController");
const {
  authMiddleware,
  requireAnyRole,
} = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/verifications/pricing:
 *   get:
 *     summary: Get pricing for verification services
 *     tags: [Verifications]
 *     responses:
 *       200:
 *         description: Verification pricing data
 */
router.get("/pricing", getVerificationPricing);

/**
 * @swagger
 * /api/verifications:
 *   get:
 *     summary: Get all verification requests (Admin/Landlord only)
 *     tags: [Verifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of verification requests
 *   post:
 *     summary: Create a new verification request
 *     tags: [Verifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Request created
 */
router
  .route("/")
  .get(authMiddleware, requireAnyRole(["admin", "landlord"]), getVerifications)
  .post(authMiddleware, createVerification);

/**
 * @swagger
 * /api/verifications/{id}:
 *   get:
 *     summary: Get verification details by ID
 *     tags: [Verifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Verification details
 *   put:
 *     summary: Update verification status or details
 *     tags: [Verifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Verification updated
 *   delete:
 *     summary: Delete a verification request (Admin only)
 *     tags: [Verifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Verification removed
 */
router
  .route("/:id")
  .get(authMiddleware, getVerificationById)
  .put(
    authMiddleware,
    requireAnyRole(["admin", "landlord"]),
    updateVerification,
  )
  .delete(authMiddleware, requireAnyRole(["admin"]), deleteVerification);

/**
 * @swagger
 * /api/verifications/{id}/notify:
 *   post:
 *     summary: Notify user to submit photos for verification
 *     tags: [Verifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Notification sent
 */
router.post(
  "/:id/notify",
  authMiddleware,
  requireAnyRole(["admin", "landlord"]),
  notifyUserAboutPhotos,
);

/**
 * @swagger
 * /api/verifications/{id}/photos:
 *   post:
 *     summary: User submits photos for verification
 *     tags: [Verifications]
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
 *             required: [photos]
 *     responses:
 *       200:
 *         description: Photos submitted
 */
router.post("/:id/photos", authMiddleware, submitUserPhotos);

/**
 * @swagger
 * /api/verifications/{id}/complete:
 *   post:
 *     summary: Admin marks inspection as complete
 *     tags: [Verifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Inspection completed
 */
router.post(
  "/:id/complete",
  authMiddleware,
  requireAnyRole(["admin"]),
  completeInspection,
);

module.exports = router;
