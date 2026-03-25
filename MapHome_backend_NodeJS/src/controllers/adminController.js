const Property = require("../models/Property");
const User = require("../models/User");
const Landlord = require("../models/Landlord");
const VerificationRequest = require("../models/VerificationRequest");
const Booking = require("../models/Booking");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProperties,
      totalUsers,
      totalLandlords,
      totalVerifications,
      totalBookings,
      pendingVerifications,
      completedVerifications,
      pendingBookings,
    ] = await Promise.all([
      Property.countDocuments(),
      User.countDocuments(),
      Landlord.countDocuments(),
      VerificationRequest.countDocuments(),
      Booking.countDocuments(),
      VerificationRequest.countDocuments({ status: "pending" }),
      VerificationRequest.countDocuments({ status: "completed" }),
      Booking.countDocuments({ status: "pending" }),
    ]);

    res.status(200).json({
      totalProperties,
      totalUsers,
      totalLandlords,
      totalVerifications,
      totalBookings,
      pendingVerifications,
      completedVerifications,
      pendingBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all verification requests for admin
// @route   GET /api/admin/verification-requests
const getVerificationRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const requests = await VerificationRequest.find(query)
      .populate("landlordId", "name phone email")
      .populate("propertyId", "name address")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve verification request
// @route   PUT /api/admin/verification/:id/approve
const approveVerification = async (req, res) => {
  try {
    const { scheduledDate } = req.body;

    const verification = await VerificationRequest.findByIdAndUpdate(
      req.params.id,
      { status: "approved", scheduledDate },
      { new: true },
    );

    if (!verification) {
      return res
        .status(404)
        .json({ message: "Verification request not found" });
    }

    res.status(200).json({
      message: "Verification approved",
      verification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject verification request
// @route   PUT /api/admin/verification/:id/reject
const rejectVerification = async (req, res) => {
  try {
    const { reason } = req.body;

    const verification = await VerificationRequest.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", rejectionReason: reason },
      { new: true },
    );

    if (!verification) {
      return res
        .status(404)
        .json({ message: "Verification request not found" });
    }

    res.status(200).json({
      message: "Verification rejected",
      verification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete inspection and award green badge
// @route   PUT /api/admin/verification/:id/complete
const completeVerification = async (req, res) => {
  try {
    const verification = await VerificationRequest.findByIdAndUpdate(
      req.params.id,
      { status: "completed", completedAt: new Date() },
      { new: true },
    );

    if (!verification) {
      return res
        .status(404)
        .json({ message: "Verification request not found" });
    }

    // Update property with verified badge
    await Property.findByIdAndUpdate(verification.propertyId, {
      verified: true,
      verifiedDate: new Date(),
    });

    res.status(200).json({
      message: "Verification completed and property verified",
      verification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle user status (active/blocked)
// @route   PUT /api/admin/users/:id/status
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === "blocked" ? "active" : "blocked";
    await user.save();

    res.status(200).json({ message: `User status changed to ${user.status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all landlords
// @route   GET /api/admin/landlords
const getAllLandlords = async (req, res) => {
  try {
    const landlords = await Landlord.find().sort({ createdAt: -1 });
    res.status(200).json(landlords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete landlord
// @route   DELETE /api/admin/landlords/:id
const deleteLandlord = async (req, res) => {
  try {
    const landlord = await Landlord.findByIdAndDelete(req.params.id);
    if (!landlord) return res.status(404).json({ message: "Landlord not found" });
    res.status(200).json({ message: "Landlord removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all properties for admin
// @route   GET /api/admin/properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("landlordId", "name phone")
      .sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("propertyId", "name address")
      .populate("userId", "username fullName")
      .populate("landlordId", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a booking (admin)
// @route   DELETE /api/admin/bookings/:id
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews
// @route   GET /api/admin/reviews
const getAllReviews = async (req, res) => {
  try {
    const Review = require("../models/Review");
    const reviews = await Review.find()
      .populate("propertyId", "name")
      .populate("userId", "username")
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review (admin)
// @route   DELETE /api/admin/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const Review = require("../models/Review");
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Review removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get platform revenue stats
// @route   GET /api/admin/revenue-stats
const getRevenueStats = async (req, res) => {
  try {
    const completedVerifications = await VerificationRequest.find({ status: "completed" });
    
    const totalRevenue = completedVerifications.reduce((sum, v) => sum + (v.amount || 0), 0);
    
    // Group by packageType
    const revenueByPackage = completedVerifications.reduce((acc, v) => {
      const type = v.packageType || 'other';
      if (!acc[type]) acc[type] = { amount: 0, count: 0 };
      acc[type].amount += v.amount || 0;
      acc[type].count += 1;
      return acc;
    }, {});

    // Last 10 transactions
    const latestTransactions = await VerificationRequest.find({ status: "completed" })
      .sort({ completedAt: -1 })
      .limit(10)
      .populate("landlordId", "name");

    // Last 6 months trends
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyTrends = await VerificationRequest.aggregate([
      {
        $match: {
          status: "completed",
          completedAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$completedAt" },
            month: { $month: "$completedAt" }
          },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({
      totalRevenue,
      revenueByPackage,
      latestTransactions,
      monthlyTrends,
      // Aggregation for regions could be added here if needed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update property status (Approved/Rejected/Reported)
// @route   PUT /api/admin/properties/:id/status
const updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected', 'reported'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!property) return res.status(404).json({ message: "Property not found" });

    res.status(200).json({ message: `Property status updated to ${status}`, property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top rooms by views
// @route   GET /api/admin/stats/top-rooms
const getTopRooms = async (req, res) => {
  try {
    const topProperties = await Property.find()
      .sort({ views: -1 })
      .limit(10)
      .populate("landlordId", "name");
    res.status(200).json(topProperties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get weekly search stats (Mock)
// @route   GET /api/admin/stats/weekly-search
const getWeeklySearchStats = async (req, res) => {
  try {
    // Mock data for weekly search trends
    const stats = [
      { day: "T2", count: 120 },
      { day: "T3", count: 150 },
      { day: "T4", count: 180 },
      { day: "T5", count: 140 },
      { day: "T6", count: 210 },
      { day: "T7", count: 250 },
      { day: "CN", count: 300 },
    ];
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Broadcast notification to all users
// @route   POST /api/admin/notifications/broadcast
const broadcastNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const Notification = require("../models/Notification");
    const users = await User.find({}, "_id");
    
    const notifications = users.map(user => ({
      userId: user._id,
      title,
      message,
      type: type || "system",
      isRead: false
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({ message: `Notification broadcasted to ${users.length} users` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getVerificationRequests,
  approveVerification,
  rejectVerification,
  completeVerification,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllLandlords,
  deleteLandlord,
  getAllProperties,
  getAllBookings,
  deleteBooking,
  getAllReviews,
  deleteReview,
  getRevenueStats,
  updatePropertyStatus,
  getTopRooms,
  getWeeklySearchStats,
  broadcastNotification,
};
