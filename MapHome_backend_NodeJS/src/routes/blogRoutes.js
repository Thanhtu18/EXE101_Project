const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const {
  authMiddleware,
  requireAnyRole,
} = require("../middleware/authMiddleware");

// Public routes
/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: List of blog posts
 */
router.get("/", blogController.getBlogs);

/**
 * @swagger
 * /api/blog/{id}:
 *   get:
 *     summary: Get single blog post by ID
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Blog post data
 */
router.get("/:id", blogController.getBlogById);

// Admin only routes
/**
 * @swagger
 * /api/blog:
 *   post:
 *     summary: Create a new blog post (Admin only)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *     responses:
 *       201:
 *         description: Blog created
 */
router.post(
  "/",
  authMiddleware,
  requireAnyRole(["admin"]),
  blogController.createBlog,
);

/**
 * @swagger
 * /api/blog/{id}:
 *   put:
 *     summary: Update an existing blog post (Admin only)
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blog updated
 */
router.put(
  "/:id",
  authMiddleware,
  requireAnyRole(["admin"]),
  blogController.updateBlog,
);

/**
 * @swagger
 * /api/blog/{id}:
 *   delete:
 *     summary: Delete a blog post (Admin only)
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blog deleted
 */
router.delete(
  "/:id",
  authMiddleware,
  requireAnyRole(["admin"]),
  blogController.deleteBlog,
);

module.exports = router;
