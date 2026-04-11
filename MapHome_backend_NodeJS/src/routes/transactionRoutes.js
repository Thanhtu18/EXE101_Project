const express = require("express");
const router = express.Router();
const { getMyTransactions } = require("../controllers/transactionController");
const { authMiddleware } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/transactions/me:
 *   get:
 *     summary: Get current user's transaction history
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get("/me", authMiddleware, getMyTransactions);

module.exports = router;
