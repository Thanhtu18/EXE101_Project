const router = require("express").Router();
const report = require("../controllers/report.controller");
const { auth } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/reports:
 *   post:
 *     tags:
 *       - Reports
 *     summary: Create a report (user)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               message:
 *                 type: string
 *               roomId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Report created
 */
// Create a report (user)
router.post("/", auth, report.createReport);

module.exports = router;
