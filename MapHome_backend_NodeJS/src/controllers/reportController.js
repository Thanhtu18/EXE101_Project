const Report = require("../models/Report");
const Property = require("../models/Property");

// @desc    Create a report
// @route   POST /api/reports
const createReport = async (req, res) => {
  try {
    const { propertyId, reason, description } = req.body;
    if (!propertyId || !reason) {
      return res.status(400).json({ message: "Property ID and reason are required" });
    }

    const report = await Report.create({
      reporterId: req.user.id,
      propertyId,
      reason,
      description,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports (Admin)
// @route   GET /api/reports
const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporterId", "username email")
      .populate("propertyId", "name address")
      .sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report status (Admin)
// @route   PUT /api/reports/:id
const updateReportStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    if (!["pending", "resolved", "dismissed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );

    if (!report) return res.status(404).json({ message: "Report not found" });

    // If resolved, we might want to flag the property as 'reported'
    if (status === "resolved") {
      await Property.findByIdAndUpdate(report.propertyId, { status: "reported" });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReport, getReports, updateReportStatus };
