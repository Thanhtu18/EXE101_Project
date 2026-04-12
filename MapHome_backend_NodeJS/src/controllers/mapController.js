const axios = require("axios");

/**
 * Map Controller - Handles integration with Goong Maps logic
 */

const GOONG_API_KEY = process.env.GOONG_API_KEY;

// @desc    Convert coordinates (lat, lng) to human-readable address
// @route   GET /api/map/reverse-geocode
const reverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const url = `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${GOONG_API_KEY}`;
    
    const response = await axios.get(url);
    
    if (response.data && response.data.results && response.data.results.length > 0) {
      res.status(200).json(response.data.results[0]);
    } else {
      res.status(404).json({ message: "No address found for these coordinates" });
    }
  } catch (error) {
    console.error("Reverse Geocode Error:", error.message);
    res.status(500).json({ message: "Error communicating with Map service" });
  }
};

// @desc    Get address suggestions based on input
// @route   GET /api/map/autocomplete
const autocomplete = async (req, res) => {
  try {
    const { input } = req.query;

    if (!input) {
      return res.status(400).json({ message: "Search input is required" });
    }

    // Bias results towards Ho Chi Minh City (10.7769, 106.7009) with 20km radius
    const locationBias = "10.7769,106.7009";
    const radiusBias = 20000;
    const url = `https://rsapi.goong.io/Place/Autocomplete?input=${encodeURIComponent(input)}&location=${locationBias}&radius=${radiusBias}&api_key=${GOONG_API_KEY}`;
    
    const response = await axios.get(url);
    res.status(200).json(response.data.predictions || []);
  } catch (error) {
    console.error("Autocomplete Error:", error.message);
    res.status(500).json({ message: "Error communicating with Map service" });
  }
};

// @desc    Get detailed info for a specific place by ID
// @route   GET /api/map/place-detail
const getPlaceDetail = async (req, res) => {
  try {
    const { place_id } = req.query;

    if (!place_id) {
      return res.status(400).json({ message: "Place ID is required" });
    }

    const url = `https://rsapi.goong.io/Place/Detail?place_id=${place_id}&api_key=${GOONG_API_KEY}`;
    
    const response = await axios.get(url);
    
    if (response.data && response.data.result) {
      res.status(200).json(response.data.result);
    } else {
      res.status(404).json({ message: "Place not found" });
    }
  } catch (error) {
    console.error("Place Detail Error:", error.message);
    res.status(500).json({ message: "Error communicating with Map service" });
  }
};

module.exports = {
  reverseGeocode,
  autocomplete,
  getPlaceDetail,
};
