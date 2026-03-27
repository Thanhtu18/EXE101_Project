const express = require("express");
const router = express.Router();
const { createReport, getReports, updateReportStatus } = require("../controllers/reportController");
const { authMiddleware, requireAnyRole } = require("../middleware/authMiddleware");

// Create report (Any logged in user)
router.post("/", authMiddleware, createReport);

// Admin routes
router.get("/", authMiddleware, requireAnyRole(["admin"]), getReports);
router.put("/:id", authMiddleware, requireAnyRole(["admin"]), updateReportStatus);

module.exports = router;
