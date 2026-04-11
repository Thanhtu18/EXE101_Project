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

/**
 * @swagger
 * /api/landlords:
 *   get:
 *     summary: Get all landlords (Admin only)
 *     tags: [Landlords]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of landlords
 *   post:
 *     summary: Create a new landlord record (Admin only)
 *     tags: [Landlords]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Landlord created
 */
router
  .route("/")
  .get(authMiddleware, requireAnyRole(["admin"]), getLandlords)
  .post(authMiddleware, requireAnyRole(["admin"]), createLandlord);

/**
 * @swagger
 * /api/landlords/{id}:
 *   get:
 *     summary: Get landlord details by ID
 *     tags: [Landlords]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Landlord data
 *   put:
 *     summary: Update landlord profile
 *     tags: [Landlords]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Landlord updated
 *   delete:
 *     summary: Delete landlord record (Admin only)
 *     tags: [Landlords]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Landlord deleted
 */
router
  .route("/:id")
  .get(getLandlordById)
  .put(authMiddleware, requireAnyRole(["admin", "landlord"]), updateLandlord)
  .delete(authMiddleware, requireAnyRole(["admin"]), deleteLandlord);

module.exports = router;
