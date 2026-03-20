const Property = require("../models/Property");

const haversineKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// @desc    Get all properties
// @route   GET /api/properties
const getProperties = async (req, res) => {
  try {
    // Basic filtering via query params (name, minPrice, maxPrice, minArea, maxArea, available)
    const query = {};
    if (req.query.name) {
      query.$or = [
        { name: new RegExp(req.query.name, "i") },
        { address: new RegExp(req.query.name, "i") },
      ];
    }
    if (req.query.minPrice)
      query.price = {
        ...(query.price || {}),
        $gte: Number(req.query.minPrice),
      };
    if (req.query.maxPrice)
      query.price = {
        ...(query.price || {}),
        $lte: Number(req.query.maxPrice),
      };
    if (req.query.minArea)
      query.area = { ...(query.area || {}), $gte: Number(req.query.minArea) };
    if (req.query.maxArea)
      query.area = { ...(query.area || {}), $lte: Number(req.query.maxArea) };
    if (req.query.available) query.available = req.query.available === "true";

    const properties = await Property.find(query).populate(
      "landlordId",
      "name phone email avatar rating",
    );
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "landlordId",
      "name phone email avatar rating",
    );
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProperty = async (req, res) => {
  try {
    const payload = { ...req.body };
    const Landlord = require("../models/Landlord");

    if (req.user) {
      const landlord = await Landlord.findOne({ userId: req.user._id });
      if (landlord) {
        payload.landlordId = landlord._id;
        payload.ownerName = landlord.name;
        
        // Increment listing count
        landlord.totalListings += 1;
        await landlord.save();
      }
    }

    const property = await Property.create(payload);
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/properties/nearby?lat=10.7&lng=106.6&radiusKm=5
const getNearbyProperties = async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radiusKm = Number(req.query.radiusKm || 5);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res
        .status(400)
        .json({ message: "lat and lng are required numbers" });
    }

    const properties = await Property.find().populate(
      "landlordId",
      "name phone email avatar rating",
    );

    const result = properties.filter((item) => {
      if (!Array.isArray(item.location) || item.location.length < 2)
        return false;
      const [itemLat, itemLng] = item.location;
      const distance = haversineKm(lat, lng, Number(itemLat), Number(itemLng));
      return distance <= radiusKm;
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const Landlord = require("../models/Landlord");
    if (property.landlordId) {
      await Landlord.findByIdAndUpdate(property.landlordId, { $inc: { totalListings: -1 } });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Property removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/properties/:id/favorite
const toggleFavorite = async (req, res) => {
  try {
    const { action } = req.body; // 'add' | 'remove'
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    if (action === "add") property.favorites = (property.favorites || 0) + 1;
    else if (action === "remove")
      property.favorites = Math.max(0, (property.favorites || 0) - 1);
    else return res.status(400).json({ message: "Invalid action" });

    await property.save();
    res.status(200).json({ favorites: property.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/properties/:id/view
const incrementView = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    );
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json({ views: property.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get properties by landlord
// @route   GET /api/properties/landlord/:landlordId
const getPropertiesByLandlord = async (req, res) => {
  try {
    const landlordId = req.params.landlordId;
    const properties = await Property.find({ landlordId }).populate(
      "landlordId",
      "name phone email avatar rating",
    );
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search properties
// @route   GET /api/properties/search?q=...&location=...&page=...&limit=...
const searchProperties = async (req, res) => {
  try {
    const {
      q,
      location,
      page = 1,
      limit = 10,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
    } = req.query;

    const query = {};

    // Search in name and address
    if (q) {
      query.$or = [
        { name: new RegExp(q, "i") },
        { address: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
      ];
    }

    // Filter by location
    if (location) {
      query.$or = query.$or || [];
      query.$or.push({ address: new RegExp(location, "i") });
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Area range
    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = Number(minArea);
      if (maxArea) query.area.$lte = Number(maxArea);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const properties = await Property.find(query)
      .populate("landlordId", "name phone email avatar rating")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(query);

    res.status(200).json({
      properties,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/properties/search-multiple?locations=[{"lat":10.7,"lng":106.6,"radius":2},...]
const searchByMultipleLocations = async (req, res) => {
  try {
    const { locations } = req.query;
    if (!locations)
      return res.status(400).json({ message: "locations query is required" });

    const searchPoints = JSON.parse(locations);
    const properties = await Property.find().populate(
      "landlordId",
      "name phone email avatar rating",
    );

    const result = properties.filter((item) => {
      if (!Array.isArray(item.location) || item.location.length < 2)
        return false;
      const [itemLat, itemLng] = item.location;

      return searchPoints.some((point) => {
        const distance = haversineKm(
          Number(point.lat),
          Number(point.lng),
          Number(itemLat),
          Number(itemLng),
        );
        return distance <= (Number(point.radius) || 2);
      });
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
