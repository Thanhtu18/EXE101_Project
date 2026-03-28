const Landlord = require("../models/Landlord");

const getOrCreateLandlord = async (user) => {
  let landlord = await Landlord.findOne({ userId: user._id });
  if (!landlord) {
    landlord = await Landlord.create({
      userId: user._id,
      name: user.fullName || user.username || "Chủ Trọ",
      email: user.email || "",
      phone: user.phone || "0000000000",
    });
  }
  return landlord;
};

// @desc    Get all landlords
// @route   GET /api/landlords
const getLandlords = async (req, res) => {
  try {
    const landlords = await Landlord.find();
    res.status(200).json(landlords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single landlord
// @route   GET /api/landlords/:id
const getLandlordById = async (req, res) => {
  try {
    const landlord = await Landlord.findById(req.params.id);
    if (!landlord) {
      return res.status(404).json({ message: "Landlord not found" });
    }
    res.status(200).json(landlord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a landlord
// @route   POST /api/landlords
const createLandlord = async (req, res) => {
  try {
    const landlord = await Landlord.create(req.body);
    res.status(201).json(landlord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a landlord
// @route   PUT /api/landlords/:id
const updateLandlord = async (req, res) => {
  try {
    const landlord = await Landlord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!landlord) {
      return res.status(404).json({ message: "Landlord not found" });
    }
    res.status(200).json(landlord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a landlord
// @route   DELETE /api/landlords/:id
const deleteLandlord = async (req, res) => {
  try {
    const landlord = await Landlord.findByIdAndDelete(req.params.id);
    if (!landlord) {
      return res.status(404).json({ message: "Landlord not found" });
    }
    res.status(200).json({ message: "Landlord removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current landlord profile
// @route   GET /api/landlord/profile
const getLandlordProfile = async (req, res) => {
  try {
    const landlord = await getOrCreateLandlord(req.user);
    res.status(200).json(landlord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current landlord's properties
// @route   GET /api/landlord/properties
const getLandlordProperties = async (req, res) => {
  try {
    const Property = require("../models/Property");
    const landlord = await getOrCreateLandlord(req.user);

    const properties = await Property.find({ landlordId: landlord._id });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current landlord's verification requests
// @route   GET /api/landlord/verification-requests
const getLandlordVerificationRequests = async (req, res) => {
  try {
    const VerificationRequest = require("../models/VerificationRequest");
    const landlord = await getOrCreateLandlord(req.user);

    const requests = await VerificationRequest.find({
      landlordId: landlord._id,
    })
      .populate("propertyId", "name address")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current landlord's bookings
// @route   GET /api/landlord/bookings
const getLandlordBookings = async (req, res) => {
  try {
    const Booking = require("../models/Booking");
    const landlord = await getOrCreateLandlord(req.user);

    const bookings = await Booking.find({ landlordId: landlord._id })
      .populate("propertyId", "name address")
      .populate("userId", "username fullName phone")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current landlord's analytics
// @route   GET /api/landlord/analytics
const getLandlordAnalytics = async (req, res) => {
  try {
    const Property = require("../models/Property");
    const Booking = require("../models/Booking");
    const VerificationRequest = require("../models/VerificationRequest");

    const landlord = await getOrCreateLandlord(req.user);

    const totalProperties = await Property.countDocuments({
      landlordId: landlord._id,
    });
    const approvedProperties = await Property.countDocuments({
      landlordId: landlord._id,
      status: "approved",
    });
    const pendingProperties = await Property.countDocuments({
      landlordId: landlord._id,
      status: "pending",
    });
    const totalBookings = await Booking.countDocuments({
      landlordId: landlord._id,
    });
    const totalVerifications = await VerificationRequest.countDocuments({
      landlordId: landlord._id,
    });
    const verifiedProperties = await Property.countDocuments({
      landlordId: landlord._id,
      "greenBadge.level": "verified",
    });

    const propertyStats = await Property.aggregate([
      { $match: { landlordId: landlord._id } },
      { $group: { 
          _id: null, 
          totalViews: { $sum: "$views" }, 
          totalFavorites: { $sum: "$favorites" } 
      }},
    ]);

    // Trend: Bookings per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const bookingTrend = await Booking.aggregate([
      { $match: { landlordId: landlord._id, createdAt: { $gte: sixMonthsAgo } } },
      { $group: { 
          _id: { $month: "$createdAt" }, 
          count: { $sum: 1 } 
      }},
      { $sort: { "_id": 1 } }
    ]);

    res.status(200).json({
      totalProperties,
      approvedProperties,
      pendingProperties,
      totalBookings,
      totalVerifications,
      verifiedProperties,
      totalViews: propertyStats[0]?.totalViews || 0,
      totalFavorites: propertyStats[0]?.totalFavorites || 0,
      bookingTrend
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLandlords,
  getLandlordById,
  createLandlord,
  updateLandlord,
  deleteLandlord,
  getLandlordProfile,
  getLandlordProperties,
  getLandlordVerificationRequests,
  getLandlordBookings,
  getLandlordAnalytics,
};
