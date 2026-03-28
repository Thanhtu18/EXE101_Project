const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getVerificationRequests,
  approveVerification,
  rejectVerification,
  completeVerification,
  getAllUsers,
  getUserDetail,
  toggleUserStatus,
  deleteUser,
  getAllLandlords,
  deleteLandlord,
  getAllProperties,
  getAllBookings,
  deleteBooking,
  getAllReviews,
  deleteReview,
  getRevenueStats,
  updatePropertyStatus,
  getTopRooms,
  getWeeklySearchStats,
  broadcastNotification,
  getAdminNotifications,
} = require("../controllers/adminController");
const {
  updateSubscriptionPlan,
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  resetSubscriptionPlans,
} = require("../controllers/subscriptionController");
const {
  getSettings,
  updateSettings,
} = require("../controllers/settingController");
const {
  authMiddleware,
  requireAnyRole,
} = require("../middleware/authMiddleware");

// All admin routes require admin authentication
router.use(authMiddleware, requireAnyRole(["admin"]));

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get("/stats", getDashboardStats);
router.get("/stats/revenue", getRevenueStats);
router.get("/stats/top-rooms", getTopRooms);
router.get("/stats/weekly-search", getWeeklySearchStats);

// User Management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserDetail);
router.put("/users/:id/status", toggleUserStatus);
router.delete("/users/:id", deleteUser);

// Landlord Management
router.get("/landlords", getAllLandlords);
router.delete("/landlords/:id", deleteLandlord);

// Property Management
router.get("/properties", getAllProperties);
router.put("/properties/:id/status", updatePropertyStatus);

// Notification Management
router.get("/notifications", getAdminNotifications);
router.post("/notifications/broadcast", broadcastNotification);

// Booking Management
router.get("/bookings", getAllBookings);
router.delete("/bookings/:id", deleteBooking);

// Review Management
router.get("/reviews", getAllReviews);
router.delete("/reviews/:id", deleteReview);

// System Settings Management
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

// Subscription Plan Management
router.post("/subscriptions/plans", createSubscriptionPlan);
router.put("/subscriptions/plans/:id", updateSubscriptionPlan);
router.delete("/subscriptions/plans/:id", deleteSubscriptionPlan);
router.post("/subscriptions/reset", resetSubscriptionPlans);

/**
 * @swagger
 * /api/admin/verification-requests:
 *   get:
 *     summary: Get all verification requests
 *     tags:
 *       - Admin Verification
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, completed]
 *         description: Filter by verification status
 *     responses:
 *       200:
 *         description: Array of verification requests
 */
router.get("/verification-requests", getVerificationRequests);

/**
 * @swagger
 * /api/admin/verification/{id}/approve:
 *   put:
 *     summary: Approve a verification request
 *     tags:
 *       - Admin Verification
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Verification approved
 */
router.put("/verification/:id/approve", approveVerification);

/**
 * @swagger
 * /api/admin/verification/{id}/reject:
 *   put:
 *     summary: Reject a verification request
 *     tags:
 *       - Admin Verification
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification rejected
 */
router.put("/verification/:id/reject", rejectVerification);

/**
 * @swagger
 * /api/admin/verification/{id}/complete:
 *   put:
 *     summary: Complete inspection and verify property
 *     tags:
 *       - Admin Verification
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
 *         description: Verification completed and property verified
 */
router.put("/verification/:id/complete", completeVerification);

module.exports = router;
