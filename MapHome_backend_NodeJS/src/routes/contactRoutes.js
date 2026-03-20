const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const {
  authMiddleware,
  requireAnyRole,
} = require("../middleware/authMiddleware");

// Public route to submit
router.post("/", contactController.submitContact);

// Admin only routes
router.get(
  "/",
  authMiddleware,
  requireAnyRole(["admin"]),
  contactController.getMessages,
);
router.delete(
  "/:id",
  authMiddleware,
  requireAnyRole(["admin"]),
  contactController.deleteMessage,
);
router.put(
  "/:id/reply",
  authMiddleware,
  requireAnyRole(["admin"]),
  contactController.replyContact,
);

module.exports = router;
