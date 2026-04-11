const express = require("express");
const router = express.Router();
const mapController = require("../controllers/mapController");

/**
 * @swagger
 * /api/map/reverse-geocode:
 *   get:
 *     summary: Convert coordinates (lat, lng) to human-readable address
 *     tags:
 *       - Map API
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude
 *         example: 10.7769
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude
 *         example: 106.7009
 *     responses:
 *       200:
 *         description: Geocode results
 *       400:
 *         description: Missing coordinates
 *       404:
 *         description: Address not found
 */
router.get("/reverse-geocode", mapController.reverseGeocode);

/**
 * @swagger
 * /api/map/autocomplete:
 *   get:
 *     summary: Get address suggestions based on input
 *     tags:
 *       - Map API
 *     parameters:
 *       - in: query
 *         name: input
 *         schema:
 *           type: string
 *         required: true
 *         description: Search text
 *         example: Đại học Bách Khoa
 *     responses:
 *       200:
 *         description: Address predictions
 *       400:
 *         description: Search input is required
 */
router.get("/autocomplete", mapController.autocomplete);

/**
 * @swagger
 * /api/map/place-detail:
 *   get:
 *     summary: Get detailed info for a specific place by ID
 *     tags:
 *       - Map API
 *     parameters:
 *       - in: query
 *         name: place_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Goong Place ID
 *         example: 9Xau7e64...
 *     responses:
 *       200:
 *         description: Place details including coordinates and components
 *       400:
 *         description: Place ID is required
 *       404:
 *         description: Place not found
 */
router.get("/place-detail", mapController.getPlaceDetail);

module.exports = router;
