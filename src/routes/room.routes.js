const router = require("express").Router();
const room = require("../controllers/room.controller");
const { auth } = require("../middleware/auth.middleware");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     tags:
 *       - Rooms
 *     summary: Get list of rooms
 *     description: Retrieve a paginated list of rooms. Supports filters via query parameters.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: A list of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *             examples:
 *               sample:
 *                 summary: Sample rooms list
 *                 value:
 *                   data:
 *                     - _id: "645a1f4c2b9a3f001234abcd"
 *                       title: "Cozy studio near downtown"
 *                       price: 350.5
 *                       favoritesCount: 42
 *                     - _id: "645a1f4c2b9a3f001234abce"
 *                       title: "Quiet room near park"
 *                       price: 250
 *                       favoritesCount: 10
 *                   meta:
 *                     total: 2
 *                     limit: 20
 *                     page: 1
 */
router.get("/", room.getRooms);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     tags:
 *       - Rooms
 *     summary: Create a new room
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Room created
 */
router.post("/", auth, room.createRoom);

// Search endpoint with filters and optional location
router.get("/search", room.searchRooms);

// Trending rooms
/**
 * @swagger
 * /api/rooms/trending:
 *   get:
 *     tags:
 *       - Rooms
 *     summary: Get trending rooms
 *     description: Returns top rooms sorted by favoritesCount (desc) and createdAt (desc).
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of rooms to return (max 100)
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: Number of rooms to skip (for paging)
 *       - in: query
 *         name: minFavorites
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Filter rooms with at least this many favorites
 *     responses:
 *       200:
 *         description: Trending rooms fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Room'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 123
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     skip:
 *                       type: integer
 *                       example: 0
 *             examples:
 *               success:
 *                 summary: Sample response
 *                 value:
 *                   data:
 *                     - _id: "645a1f4c2b9a3f001234abcd"
 *                       title: "Cozy studio near downtown"
 *                       description: "Bright, fully-furnished studio..."
 *                       price: 350.5
 *                       currency: "USD"
 *                       images:
 *                         - "https://.../img1.jpg"
 *                       location:
 *                         address: "123 Main St, City"
 *                         lat: 40.7128
 *                         lng: -74.0060
 *                       favoritesCount: 42
 *                       createdAt: "2026-03-10T12:34:56.789Z"
 *                   meta:
 *                     total: 42
 *                     limit: 10
 *                     skip: 0
 *       400:
 *         description: Invalid query parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "limit must be an integer between 1 and 100"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database unreachable"
 */
router.get("/trending", room.getTrendingRooms);

// Upload images for a room (owner only)
router.post("/:id/images", auth, upload.array("images", 5), room.uploadImages);

/**
 * @swagger
 * /api/rooms/{id}/images:
 *   post:
 *     tags:
 *       - Rooms
 *     summary: Upload images for a room (owner only)
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded
 */

// Verify GPS for a room (owner only)
router.post("/:id/verify-gps", auth, room.verifyGPS);

/**
 * @swagger
 * /api/rooms/{id}/verify-gps:
 *   post:
 *     tags:
 *       - Rooms
 *     summary: Verify GPS coordinates for a room (owner only)
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
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *     responses:
 *       200:
 *         description: GPS verified
 */

module.exports = router;
