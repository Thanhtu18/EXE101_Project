const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    password: String,
    role: {
      type: String,
      enum: ["admin", "landlord", "user"],
      default: "user",
    },
    verificationLevel: {
      type: Number,
      default: 1,
    },
    phoneOtp: String,
    phoneOtpExpires: Date,
    phoneVerified: { type: Boolean, default: false },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
