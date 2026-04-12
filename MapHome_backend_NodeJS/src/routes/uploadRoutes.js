const express = require("express");
const router = express.Router();
const {
  uploadSingleImage,
  uploadMultipleImages,
} = require("../controllers/uploadController");
const { upload } = require("../middleware/uploadMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/uploads/single:
 *   post:
 *     summary: Upload a single image to Cloudinary
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post(
  "/single",
  authMiddleware,
  upload.single("image"),
  uploadSingleImage,
);

/**
 * @swagger
 * /api/uploads/multiple:
 *   post:
 *     summary: Upload multiple images to Cloudinary
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
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
 *         description: Images uploaded successfully
 */
router.post(
  "/multiple",
  authMiddleware,
  upload.array("images", 10),
  uploadMultipleImages,
);

module.exports = router;
