const User = require("../models/User");
const sanitizeUser = require("../lib/sanitizeUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role });
  // Do not return password hash to client — return sanitized user
  return res.status(201).json(sanitizeUser(user));
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json("User not found");
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json("Wrong password");
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  // Return only minimal user fields to the client
  res.json({ token, user: sanitizeUser(user) });
};

// Dev-friendly OTP endpoints (simulate SMS). In production use an SMS provider and hash codes.
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "phone required" });
  const user = await User.findOne({ phone });
  if (!user)
    return res.status(404).json({ error: "User with phone not found" });
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  // store plain code for dev; production: store hash
  user.phoneOtp = code;
  user.phoneOtpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await user.save();
  // In dev return code so frontend can display; production should NOT return
  return res.json({ success: true, otp: code });
};

exports.confirmOtp = async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code)
    return res.status(400).json({ error: "phone and code required" });
  const user = await User.findOne({ phone });
  if (!user) return res.status(404).json({ error: "User not found" });
  if (!user.phoneOtp || !user.phoneOtpExpires)
    return res.status(400).json({ error: "No OTP requested" });
  if (new Date() > user.phoneOtpExpires)
    return res.status(400).json({ error: "OTP expired" });
  if (user.phoneOtp !== code)
    return res.status(400).json({ error: "Invalid OTP" });
  user.phoneVerified = true;
  user.verificationLevel = Math.max(user.verificationLevel || 1, 2);
  user.phoneOtp = undefined;
  user.phoneOtpExpires = undefined;
  await user.save();
  // Return only minimal user fields to the client
  return res.json({ success: true, user: sanitizeUser(user) });
};
