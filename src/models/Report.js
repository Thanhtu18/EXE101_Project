const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      enum: ["fake_listing", "wrong_price", "already_rented", "spam", "other"],
      required: true,
    },
    message: String,
    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Report", ReportSchema);
