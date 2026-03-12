const router = require("express").Router();
const user = require("../controllers/user.controller");
const { auth } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/users/favorites/{roomId}:
 *   post:
 *     tags:
 *       - Users
 *     summary: Toggle favorite for a room (add/remove)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorite toggled
 */
// Toggle favorite
router.post("/favorites/:roomId", auth, user.toggleFavorite);

/**
 * @swagger
 * /api/users/favorites:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user's favorite rooms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of favorite rooms
 */
// Get favorites
router.get("/favorites", auth, user.getFavorites);

/**
 * @swagger
 * /api/users/favorites/check/{roomId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Check if a room is favorited by current user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: { isFavorite: boolean }
 */
// Check favorite
router.get("/favorites/check/:roomId", auth, user.checkFavorite);

module.exports = router;
