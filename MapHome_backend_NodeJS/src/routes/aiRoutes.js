const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../controllers/aiController");

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Chat with AI Advisor
 *     tags: [AI]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: Tìm cho tôi phòng trọ tốt tại Quận 7
 *               propertyId:
 *                 type: string
 *                 example: 61a7f8e4b2c1234567890abc
 *               history:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: AI response
 *       500:
 *         description: Error communicating with AI
 */
router.post("/chat", chatWithAI);
router.post("/chatai", chatWithAI); // Alias cho sự tương thích

module.exports = router;
