const Room = require("../models/Room");

// Get all approved rooms (simple)
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: "approved" }).populate("owner");
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a room (owner is the authenticated user)
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create({ ...req.body, owner: req.user.id });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload images (max 5) - expects multer to populate req.files
exports.uploadImages = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    if (room.owner.toString() !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });
    const files = req.files || [];
    const urls = files.map((f) => `/uploads/${f.filename}`);
    room.images = (room.images || []).concat(urls).slice(0, 5);
    await room.save();
    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify GPS coordinates for a room (owner only)
exports.verifyGPS = async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    if (room.owner.toString() !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });
    room.verification = room.verification || {};
    room.verification.gps = {
      coordinates: [Number(longitude), Number(latitude)],
      accuracy: Number(accuracy),
      verifiedAt: new Date(),
    };
    room.verification.level = 3;
    await room.save();
    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search with basic filters and geospatial support.
// Supports viewport (bbox) search via minLat/maxLat/minLng/maxLng or point radius via lat/lng+radius.
exports.searchRooms = async (req, res) => {
  try {
    const {
      lat,
      lng,
      radius = 5000,
      priceMin,
      priceMax,
      areaMin,
      areaMax,
      amenities,
      verificationLevel,
      available,
      minLat,
      maxLat,
      minLng,
      maxLng,
      limit: qLimit,
      select,
    } = req.query;

    const filter = { status: "approved" };
    if (priceMin || priceMax) filter.price = {};
    if (priceMin) filter.price.$gte = Number(priceMin);
    if (priceMax) filter.price.$lte = Number(priceMax);
    if (areaMin || areaMax) filter.area = {};
    if (areaMin) filter.area.$gte = Number(areaMin);
    if (areaMax) filter.area.$lte = Number(areaMax);
    if (typeof available !== "undefined")
      filter.available = available === "true";
    if (verificationLevel)
      filter["verification.level"] = { $gte: Number(verificationLevel) };
    if (amenities) {
      const arr = amenities.split(",");
      arr.forEach((a) => (filter[`amenities.${a}`] = true));
    }

    const limit = Math.min(Number(qLimit) || 100, 500);

    // BBOX / viewport search
    if (minLat && maxLat && minLng && maxLng) {
      const box = [
        [parseFloat(minLng), parseFloat(minLat)],
        [parseFloat(maxLng), parseFloat(maxLat)],
      ];
      filter.location = { $geoWithin: { $box: box } };
      let query = Room.find(filter).limit(limit).populate("owner");
      if (select) query = query.select(select.split(",").join(" "));
      const rooms = await query;
      return res.json(rooms);
    }

    // Point + radius search fallback
    if (lat && lng) {
      filter.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(radius),
        },
      };
    }

    let query = Room.find(filter).limit(limit).populate("owner");
    if (select) query = query.select(select.split(",").join(" "));
    const rooms = await query;
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get trending rooms sorted by favoritesCount desc, then createdAt desc
exports.getTrendingRooms = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const rooms = await Room.find({ status: "approved" })
      .sort({ favoritesCount: -1, createdAt: -1 })
      .limit(limit)
      .populate("owner");
    return res.json(rooms);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
