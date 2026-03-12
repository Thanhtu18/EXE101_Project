const Room = require("../models/Room");
const Report = require("../models/Report");
const Booking = require("../models/Booking");
const User = require("../models/User");

// Get rooms with status pending
exports.getPendingRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: "pending" }).populate("owner");
    return res.json(rooms);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Approve a room
exports.approveRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true },
    ).populate("owner");
    return res.json(room);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Reject a room
exports.rejectRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true },
    ).populate("owner");
    return res.json(room);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get all reports for admin review
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("room").populate("user");
    return res.json(reports);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Resolve a report (admin)
exports.resolveReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true },
    );
    return res.json(report);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin stats: counts of users, rooms, bookings, reports
exports.getStats = async (req, res) => {
  try {
    const [users, rooms, bookings, reports] = await Promise.all([
      User.countDocuments(),
      Room.countDocuments(),
      Booking.countDocuments(),
      Report.countDocuments(),
    ]);

    return res.json({
      users,
      rooms,
      bookings,
      reports,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
