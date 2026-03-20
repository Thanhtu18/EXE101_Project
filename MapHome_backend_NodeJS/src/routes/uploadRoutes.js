const express = require("express");
const router = express.Router();
const {
  uploadSingleImage,
  uploadMultipleImages,
} = require("../controllers/uploadController");
const { upload } = require("../middleware/uploadMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post(
  "/single",
  authMiddleware,
  upload.single("image"),
  uploadSingleImage,
);
router.post(
  "/multiple",
  authMiddleware,
  upload.array("images", 10),
  uploadMultipleImages,
);

module.exports = router;
