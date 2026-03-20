const express = require("express");
const router = express.Router();
const {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");
const {
  authMiddleware,
  requireAnyRole,
} = require("../middleware/authMiddleware");

router
  .route("/")
  .get(authMiddleware, requireAnyRole(["admin", "landlord"]), getBookings)
  .post(authMiddleware, createBooking);

router
  .route("/:id")
  .get(authMiddleware, getBookingById)
  .put(authMiddleware, requireAnyRole(["admin", "landlord"]), updateBooking)
  .delete(authMiddleware, requireAnyRole(["admin", "landlord"]), deleteBooking);

module.exports = router;
