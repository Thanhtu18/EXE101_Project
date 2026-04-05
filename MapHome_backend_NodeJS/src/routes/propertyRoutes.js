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
  getPublicStats,
  getDistrictsStats,
  renewProperty,
} = require("../controllers/propertyController");
const { 
  createPropertyRules, 
  updatePropertyRules, 
  searchPropertiesRules, 
  nearbyPropertiesRules 
} = require("../validators/propertyValidator");
const validate = require("../middleware/validate");

const {
  authMiddleware,
  requireAnyRole,
} = require("../middleware/authMiddleware");

// Public statistics and district aggregates
router.get("/stats/public", getPublicStats);
router.get("/stats/districts", getDistrictsStats);

// Search route (must come before /:id pattern)
router.get("/search", searchPropertiesRules, validate, searchProperties);


// Nearby route
router.get("/nearby", nearbyPropertiesRules, validate, getNearbyProperties);


// Multiple location search (for workplace search)
router.get("/search-multiple", searchByMultipleLocations);

// By landlord route
router.get("/landlord/:landlordId", getPropertiesByLandlord);

router
  .route("/")
  .get(getProperties)
  .post(authMiddleware, requireAnyRole(["landlord"]), createPropertyRules, validate, createProperty);


router
  .route("/:id")
  .get(getPropertyById)
  .put(authMiddleware, requireAnyRole(["landlord"]), updatePropertyRules, validate, updateProperty)
  .delete(authMiddleware, requireAnyRole(["landlord"]), deleteProperty);


// Additional actions
router.post("/:id/favorite", authMiddleware, toggleFavorite);
router.post("/:id/view", incrementView);
router.put("/:id/renew", authMiddleware, requireAnyRole(["landlord"]), renewProperty);

module.exports = router;
