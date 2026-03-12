const router = require("express").Router();
const admin = require("../controllers/admin.controller");
const { auth, requireRole } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/admin/rooms/pending:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get rooms pending approval
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending rooms
 */
// Get pending rooms
router.get("/rooms/pending", auth, requireRole("admin"), admin.getPendingRooms);

/**
 * @swagger
 * /api/admin/rooms/{id}/approve:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Approve a pending room
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room approved
 */
// Approve room
router.patch(
  "/rooms/:id/approve",
  auth,
  requireRole("admin"),
  admin.approveRoom,
);

/**
 * @swagger
 * /api/admin/rooms/{id}/reject:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Reject a pending room
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room rejected
 */
// Reject room
router.patch("/rooms/:id/reject", auth, requireRole("admin"), admin.rejectRoom);

/**
 * @swagger
 * /api/admin/reports:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get reports (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reports
 */
// Admin: get reports
router.get("/reports", auth, requireRole("admin"), admin.getReports);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get admin statistics (counts)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin stats
 */
// Admin stats: users, rooms, bookings, reports
router.get("/stats", auth, requireRole("admin"), admin.getStats);

/**
 * @swagger
 * /api/admin/reports/{id}/resolve:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Resolve a report
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report resolved
 */
// Admin: resolve report
router.patch(
  "/reports/:id/resolve",
  auth,
  requireRole("admin"),
  admin.resolveReport,
);

module.exports = router;
