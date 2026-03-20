const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res
        .status(401)
        .json({ message: "Invalid token (user not found)" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role !== role && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

const requireAnyRole = (roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (req.user.role === "admin" || allowed.includes(req.user.role))
    return next();
  return res.status(403).json({ message: "Forbidden" });
};

const requireSelfOrAdmin =
  (paramKey = "id") =>
  (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    if (
      req.user.role === "admin" ||
      String(req.user._id) === String(req.params[paramKey])
    )
      return next();
    return res.status(403).json({ message: "Forbidden" });
  };

module.exports = {
  authMiddleware,
  requireRole,
  requireAnyRole,
  requireSelfOrAdmin,
};
