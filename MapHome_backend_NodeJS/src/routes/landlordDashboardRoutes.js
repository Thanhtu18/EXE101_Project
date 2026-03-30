const express = require("express");
const router = express.Router();
const {
  getLandlordProfile,
  getLandlordProperties,
  getLandlordVerificationRequests,
  getLandlordBookings,
  getLandlordAnalytics,
  getLandlordLeads,
} = require("../controllers/landlordController");
const {
  authMiddleware,
  requireAnyRole,
} = require("../middleware/authMiddleware");

// All landlord dashboard routes require landlord authentication
router.use(authMiddleware, requireAnyRole(["landlord"]));

/**
 * @swagger
 * /api/landlord/profile:
 *   get:
 *     summary: Get current landlord's profile
 *     tags:
 *       - Landlord Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Landlord profile data
 *       404:
 *         description: Landlord profile not found
 */
router.get("/profile", getLandlordProfile);

/**
 * @swagger
 * /api/landlord/properties:
 *   get:
 *     summary: Get current landlord's properties
 *     tags:
 *       - Landlord Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of landlord's properties
 *       404:
 *         description: Landlord profile not found
 */
router.get("/properties", getLandlordProperties);

/**
 * @swagger
 * /api/landlord/verification-requests:
 *   get:
 *     summary: Get current landlord's verification requests
 *     tags:
 *       - Landlord Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of verification requests
 *       404:
 *         description: Landlord profile not found
 */
router.get("/verification-requests", getLandlordVerificationRequests);

/**
 * @swagger
 * /api/landlord/bookings:
 *   get:
 *     summary: Get current landlord's bookings
 *     tags:
 *       - Landlord Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of bookings
 *       404:
 *         description: Landlord profile not found
 */
router.get("/bookings", getLandlordBookings);

/**
 * @swagger
 * /api/landlord/analytics:
 *   get:
 *     summary: Get current landlord's analytics dashboard data
 *     tags:
 *       - Landlord Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data including property counts, views, bookings
 *       404:
 *         description: Landlord profile not found
 */
router.get("/analytics", getLandlordAnalytics);

/**
 * @swagger
 * /api/landlord/leads:
 *   get:
 *     summary: Get relevant leads for the current landlord based on their property districts
 *     tags:
 *       - Landlord Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of relevant leads
 *       404:
 *         description: Landlord profile not found
 */
router.get("/leads", getLandlordLeads);

module.exports = router;
