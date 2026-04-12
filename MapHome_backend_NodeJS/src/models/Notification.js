const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["info", "warning", "success", "error", "booking", "verification"],
      default: "info",
    },
    isRead: { type: Boolean, default: false },
    link: { type: String }, // Optional link to a page (e.g. /room/123)
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", NotificationSchema);
