const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    fullName: { type: String },
    phone: { type: String },
    requirements: {
      district: { type: String, required: true },
      maxPrice: { type: Number, required: true },
      amenities: [{ type: String }],
      moveInDate: { type: Date },
    },
    source: { type: String, default: "AI_Chat" },
    status: {
      type: String,
      enum: ["captured", "matched", "contacted", "rejected"],
      default: "captured",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Lead", LeadSchema);
