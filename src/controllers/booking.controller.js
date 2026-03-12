const Booking = require("../models/Booking");
const Room = require("../models/Room");

// Create a booking for a room (user)
exports.createBooking = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });
    const { date, message } = req.body;
    // Basic validation: date must be within next 30 days
    const d = new Date(date);
    const now = new Date();
    const max = new Date();
    max.setDate(now.getDate() + 30);
    if (d < new Date(now.setHours(0, 0, 0, 0)) || d > max)
      return res.status(400).json({ error: "Date out of allowed range" });
    const booking = await Booking.create({
      room: room._id,
      owner: room.owner,
      user: req.user.id,
      date: d,
      message,
    });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get bookings for current user
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("room");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get bookings for rooms owned by current user (owner view)
exports.getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user.id })
      .populate("room")
      .populate("user");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Owner confirms a booking
exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("room");
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    // only room owner can confirm
    if (booking.owner.toString() !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });
    booking.status = "confirmed";
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Owner rejects a booking
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("room");
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    // only room owner can reject
    if (booking.owner.toString() !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });
    booking.status = "rejected";
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel booking (user or owner)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("room");
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    const isOwner = booking.owner.toString() === req.user.id;
    const isUser = booking.user.toString() === req.user.id;
    if (!isOwner && !isUser)
      return res.status(403).json({ error: "Forbidden" });
    booking.status = "cancelled";
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
