const express = require("express");
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  getNearbyProperties,
  updateProperty,
  deleteProperty,
  toggleFavorite,
  incrementView,
  getPropertiesByLandlord,
  searchProperties,
  searchByMultipleLocations,
} = require("../controllers/propertyController");
const {
  authMiddleware,
  requireAnyRole,
} = require("../middleware/authMiddleware");

// Search route (must come before /:id pattern)
router.get("/search", searchProperties);

// Nearby route
router.get("/nearby", getNearbyProperties);

// Multiple location search (for workplace search)
router.get("/search-multiple", searchByMultipleLocations);

// By landlord route
router.get("/landlord/:landlordId", getPropertiesByLandlord);

router
  .route("/")
  .get(getProperties)
  .post(authMiddleware, requireAnyRole(["landlord"]), createProperty);

router
  .route("/:id")
  .get(getPropertyById)
  .put(authMiddleware, requireAnyRole(["landlord"]), updateProperty)
  .delete(authMiddleware, requireAnyRole(["landlord"]), deleteProperty);

// Additional actions
router.post("/:id/favorite", authMiddleware, toggleFavorite);
router.post("/:id/view", incrementView);

module.exports = router;
