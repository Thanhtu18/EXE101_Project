const express = require("express");
const router = express.Router();
const { createReport, getReports, updateReportStatus } = require("../controllers/reportController");
const { authMiddleware, requireAnyRole } = require("../middleware/authMiddleware");

// Create report (Any logged in user)
/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Create a new abuse/issue report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetId, targetType, reason]
 *             properties:
 *               targetId: { type: string, description: "ID of property or user being reported" }
 *               targetType: { type: string, enum: [property, user, review] }
 *               reason: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Report submitted
 */
router.post("/", authMiddleware, createReport);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get all reports (Admin only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all reports
 */
router.get("/", authMiddleware, requireAnyRole(["admin"]), getReports);

/**
 * @swagger
 * /api/reports/{id}:
 *   put:
 *     summary: Update report status (Admin only)
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [pending, resolved, dismissed] }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report status updated
 */
router.put("/:id", authMiddleware, requireAnyRole(["admin"]), updateReportStatus);

module.exports = router;
