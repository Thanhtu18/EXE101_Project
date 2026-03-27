const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },

    fullName: { type: String },
    phone: { type: String },
    role: {
      type: String,
      enum: ["admin", "landlord", "user"],
      default: "user",
    },
    verificationLevel: { type: Number, default: 1 },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
