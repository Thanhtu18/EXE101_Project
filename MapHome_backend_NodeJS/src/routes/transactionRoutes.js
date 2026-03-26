const express = require("express");
const router = express.Router();
const { getMyTransactions } = require("../controllers/transactionController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, getMyTransactions);

module.exports = router;
