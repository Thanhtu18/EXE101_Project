const express = require("express");
const router = express.Router();
const {
  getMySubscription,
  getAvailablePlans,
  subscribe,
} = require("../controllers/subscriptionController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, getMySubscription);
router.get("/plans", getAvailablePlans);
router.post("/subscribe", authMiddleware, subscribe);

module.exports = router;
