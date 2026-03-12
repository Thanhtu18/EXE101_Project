const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    address: { type: String, required: true },
    description: String,
    area: Number, // m2
    images: { type: [String], default: [] },
    amenities: {
      wifi: { type: Boolean, default: false },
      furniture: { type: Boolean, default: false },
      tv: { type: Boolean, default: false },
      washer: { type: Boolean, default: false },
      kitchen: { type: Boolean, default: false },
      fridge: { type: Boolean, default: false },
      ac: { type: Boolean, default: false },
    },
    phone: String,
    available: { type: Boolean, default: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verification: {
      level: { type: Number, default: 1 },
      phoneVerified: { type: Boolean, default: false },
      gps: {
        coordinates: { type: [Number], index: "2dsphere" },
        accuracy: Number,
        verifiedAt: Date,
      },
    },
    views: { type: Number, default: 0 },
    favoritesCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Room", roomSchema);
