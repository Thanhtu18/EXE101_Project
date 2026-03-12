const Report = require("../models/Report");
const Room = require("../models/Room");

// Create a report by an authenticated user
exports.createReport = async (req, res) => {
  try {
    const { room, reason, message } = req.body;
    if (!room || !reason)
      return res.status(400).json({ error: "room and reason are required" });

    const report = await Report.create({
      room,
      reason,
      message,
      user: req.user.id,
    });

    // Optional: auto-change room status if number of reports exceeds threshold
    const reportsCount = await Report.countDocuments({ room });
    if (reportsCount >= 5) {
      await Room.findByIdAndUpdate(room, { status: "pending" });
    }

    return res.json(report);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
