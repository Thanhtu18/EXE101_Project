const express = require("express");
const router = express.Router();
const {
  getLandlords,
  getLandlordById,
  createLandlord,
  updateLandlord,
  deleteLandlord,
} = require("../controllers/landlordController");
const {
  authMiddleware,
  requireAnyRole,
} = require("../middleware/authMiddleware");

router
  .route("/")
  .get(getLandlords)
  .post(authMiddleware, requireAnyRole(["admin"]), createLandlord);
router
  .route("/:id")
  .get(getLandlordById)
  .put(authMiddleware, requireAnyRole(["admin", "landlord"]), updateLandlord)
  .delete(authMiddleware, requireAnyRole(["admin"]), deleteLandlord);

module.exports = router;
