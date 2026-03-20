const express = require("express");
const router = express.Router();
const {
  createPayment,
  paymentCallback,
} = require("../controllers/paymentController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, createPayment);
router.get("/callback", paymentCallback);

module.exports = router;
