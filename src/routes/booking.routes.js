const router = require("express").Router();
const booking = require("../controllers/booking.controller");
const { auth } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/bookings/rooms/{roomId}:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Create a booking for a room
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
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
 *               date:
 *                 type: string
 *                 format: date
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 roomId:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 status:
 *                   type: string
 *             examples:
 *               success:
 *                 summary: Sample booking created
 *                 value:
 *                   _id: "66b1b2c3d4e5f67890123456"
 *                   roomId: "645a1f4c2b9a3f001234abcd"
 *                   userId: "64ff1a2b3c4d5e6f708090ab"
 *                   date: "2026-04-01"
 *                   status: "pending"
 */
// Create booking for a room
router.post("/rooms/:roomId", auth, booking.createBooking);

/**
 * @swagger
 * /api/bookings/my:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get current user's bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings for current user
 */
// Get current user's bookings
router.get("/my", auth, booking.getMyBookings);

/**
 * @swagger
 * /api/bookings/owner:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get bookings for owner
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings for rooms owned by current user
 */
// Get bookings for owner (rooms owned by current user)
router.get("/owner", auth, booking.getOwnerBookings);

// Owner confirm booking
router.patch("/:id/confirm", auth, booking.confirmBooking);

/**
 * @swagger
 * /api/bookings/{id}/confirm:
 *   patch:
 *     tags:
 *       - Bookings
 *     summary: Owner confirms a booking
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
 *         description: Booking confirmed
 */

// Owner reject booking
router.patch("/:id/reject", auth, booking.rejectBooking);

/**
 * @swagger
 * /api/bookings/{id}/reject:
 *   patch:
 *     tags:
 *       - Bookings
 *     summary: Owner rejects a booking
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
 *         description: Booking rejected
 */

// Cancel booking (user or owner)
router.patch("/:id/cancel", auth, booking.cancelBooking);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   patch:
 *     tags:
 *       - Bookings
 *     summary: Cancel a booking (user or owner)
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
 *         description: Booking cancelled
 */

module.exports = router;
