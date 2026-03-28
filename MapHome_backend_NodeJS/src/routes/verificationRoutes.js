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

// Public routes
router.get("/pricing", getVerificationPricing);

router
  .route("/")
  .get(authMiddleware, requireAnyRole(["admin", "landlord"]), getVerifications)
  .post(authMiddleware, createVerification);
router
  .route("/:id")
  .get(authMiddleware, getVerificationById)
  .put(
    authMiddleware,
    requireAnyRole(["admin", "landlord"]),
    updateVerification,
  )
  .delete(authMiddleware, requireAnyRole(["admin"]), deleteVerification);

// Notify user to submit photos
router.post(
  "/:id/notify",
  authMiddleware,
  requireAnyRole(["admin", "landlord"]),
  notifyUserAboutPhotos,
);
// User submits photos
router.post("/:id/photos", authMiddleware, submitUserPhotos);
router.post(
  "/:id/complete",
  authMiddleware,
  requireAnyRole(["admin"]),
  completeInspection,
);

module.exports = router;
