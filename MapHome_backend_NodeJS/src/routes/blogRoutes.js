const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const {
  authMiddleware,
  requireAnyRole,
} = require("../middleware/authMiddleware");

// Public routes
router.get("/", blogController.getBlogs);
router.get("/:id", blogController.getBlogById);

// Admin only routes
router.post(
  "/",
  authMiddleware,
  requireAnyRole(["admin"]),
  blogController.createBlog,
);
router.put(
  "/:id",
  authMiddleware,
  requireAnyRole(["admin"]),
  blogController.updateBlog,
);
router.delete(
  "/:id",
  authMiddleware,
  requireAnyRole(["admin"]),
  blogController.deleteBlog,
);

module.exports = router;
