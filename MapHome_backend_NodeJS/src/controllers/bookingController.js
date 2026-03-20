const Booking = require("../models/Booking");

const getBookings = async (req, res) => {
  try {
    const query = {};
    if (req.query.propertyId) query.propertyId = req.query.propertyId;
    if (req.query.userId) query.userId = req.query.userId;
    if (req.query.landlordId) query.landlordId = req.query.landlordId;
    if (req.query.status) query.status = req.query.status;

    const bookings = await Booking.find(query)
      .populate("propertyId", "name address")
      .populate("userId", "username fullName phone")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("propertyId", "name address")
      .populate("userId", "username fullName phone");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const Property = require("../models/Property");
    const payload = { ...req.body };
    
    if (req.user && req.user.role === "user") {
      payload.userId = req.user._id;
    }

    // Auto-find landlordId from Property if not in payload
    if (payload.propertyId && !payload.landlordId) {
      const property = await Property.findById(payload.propertyId);
      if (property) {
        payload.landlordId = property.landlordId;
      }
    }

    const booking = await Booking.create(payload);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
