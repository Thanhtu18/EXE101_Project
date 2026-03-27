const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const Landlord = require("../models/Landlord");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// POST /api/auth/register
const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      fullName,
      phone,
      role,
    } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Basic email validation
    const emailRe = /^\S+@\S+\.\S+$/;
    if (!emailRe.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Basic phone validation (digits, allow +, length 7-15)
    if (phone) {
      const phoneRe = /^[+]?\d{7,15}$/;
      if (!phoneRe.test(phone)) {
        return res.status(400).json({ message: "Invalid phone number" });
      }
    }

    // Normalize role values from frontend labels if necessary
    let normalizedRole = "user";
    if (role) {
      const r = String(role).toLowerCase();
      if (
        r.includes("landlord") ||
        r.includes("chutro") ||
        r.includes("chủ") ||
        r.includes("owner")
      ) {
        normalizedRole = "landlord";
      } else if (r.includes("admin")) {
        normalizedRole = "admin";
      } else {
        normalizedRole = "user";
      }
    }

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing)
      return res
        .status(400)
        .json({ message: "Username or email already in use" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashed,
      fullName,
      phone,
      role: normalizedRole,
    });

    // Auto-create Landlord profile if role is landlord
    if (normalizedRole === "landlord") {
      await Landlord.create({
        name: fullName || username,
        phone: phone || "0000000000",
        email,
        userId: user._id,
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" },
    );

    const userSafe = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
      verificationLevel: user.verificationLevel,
    };

    res.status(201).json({ message: "User registered", user: userSafe, token });
  } catch (error) {
    console.error("[Auth Error]:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { usernameOrEmail, username, email, password } = req.body;
    const identifier = usernameOrEmail || email || username;

    if (!identifier || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (user.status === "blocked") {
      return res
        .status(403)
        .json({ message: "Account is blocked. Please contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" },
    );

    const userSafe = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
      verificationLevel: user.verificationLevel,
    };

    res.status(200).json({ user: userSafe, token });
  } catch (error) {
    console.error("[Auth Error]:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("[Auth Error]:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User with this email not found" });

    // Generate basic numeric token for demo purposes (as per frontend expectations usually)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // In a real app, send email here. For now returning token in response for testing.
    res.status(200).json({ 
      message: "Password reset token sent to email", 
      token: resetToken // Returning token for convenience during development
    });
  } catch (error) {
    console.error("[Auth Error]:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("[Auth Error]:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/google
const googleLogin = async (req, res) => {
  try {
    const { idToken, accessToken, role } = req.body;
    if (!idToken && !accessToken) {
      return res.status(400).json({ message: "Google ID Token or Access Token required" });
    }

    let payload;
    let googleId, email, name, picture;

    if (idToken) {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    } else {
      // Verify using accessToken
      client.setCredentials({ access_token: accessToken });
      const userInfo = await client.request({
        url: "https://www.googleapis.com/oauth2/v3/userinfo",
      });
      payload = userInfo.data;
      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // Normalize role if provided
      let normalizedRole = "user";
      if (role) {
        const r = String(role).toLowerCase();
        if (
          r.includes("landlord") ||
          r.includes("chutro") ||
          r.includes("chủ") ||
          r.includes("owner")
        ) {
          normalizedRole = "landlord";
        } else if (r.includes("admin")) {
          normalizedRole = "admin";
        } else {
          normalizedRole = "user";
        }
      }

      // Create new user if not exists
      const username = email.split("@")[0] + "_" + Math.floor(Math.random() * 1000);
      user = await User.create({
        username,
        email,
        googleId,
        fullName: name,
        role: normalizedRole,
        status: "active",
      });

      // Auto-create Landlord profile if role is landlord
      if (normalizedRole === "landlord") {
        await Landlord.create({
          name: name || username,
          email,
          userId: user._id,
        });
      }
    } else if (!user.googleId) {
      // Link googleId to existing user with same email
      user.googleId = googleId;
      await user.save();
    }

    if (user.status === "blocked") {
      return res.status(403).json({ message: "Account is blocked. Please contact support." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" },
    );

    const userSafe = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
      verificationLevel: user.verificationLevel,
      picture
    };

    res.status(200).json({ user: userSafe, token });
  } catch (error) {
    console.error("[Auth Error]:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, changePassword, forgotPassword, resetPassword, googleLogin };

