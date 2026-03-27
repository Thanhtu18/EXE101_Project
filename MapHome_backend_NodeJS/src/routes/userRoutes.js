const express = require("express");
const router = express.Router();
const {
  getUserById,
  updateUser,
  getMyProfile,
  getMyFavorites,
  toggleFavoriteProperty,
  getMyBookings,
  getMyInspections,
} = require("../controllers/userController");
const {
  authMiddleware,
  requireSelfOrAdmin,
} = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get current user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 */
router.get("/me", authMiddleware, getMyProfile);

/**
 * @swagger
 * /api/user/me/favorites:
 *   get:
 *     summary: Get current user's favorite properties
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of favorite properties
 */
router.get("/me/favorites", authMiddleware, getMyFavorites);

/**
 * @swagger
 * /api/user/me/favorites/toggle:
 *   post:
 *     summary: Toggle favorite property
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Favorite toggled
 */
router.post("/me/favorites/toggle", authMiddleware, toggleFavoriteProperty);

/**
 * @swagger
 * /api/user/bookings:
 *   get:
 *     summary: Get current user's bookings
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of user's bookings
 */
router.get("/bookings", authMiddleware, getMyBookings);

/**
 * @swagger
 * /api/user/inspections:
 *   get:
 *     summary: Get current user's inspection requests
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of user's inspection requests
 */
router.get("/inspections", authMiddleware, getMyInspections);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - User
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
 *         description: User profile
 *   put:
 *     summary: Update user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated
 */
router
  .route("/:id")
  .get(authMiddleware, requireSelfOrAdmin("id"), getUserById)
  .put(authMiddleware, requireSelfOrAdmin("id"), updateUser);

module.exports = router;
