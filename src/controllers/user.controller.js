const User = require("../models/User");
const Room = require("../models/Room");

// Toggle favorite for a room by current user
exports.toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const roomId = req.params.roomId;
    const idx = user.favorites.findIndex((f) => f.toString() === roomId);
    if (idx === -1) {
      user.favorites.push(roomId);
      room.favoritesCount = (room.favoritesCount || 0) + 1;
    } else {
      user.favorites.splice(idx, 1);
      room.favoritesCount = Math.max((room.favoritesCount || 1) - 1, 0);
    }

    await user.save();
    await room.save();

    return res.json({
      favorites: user.favorites,
      favoritesCount: room.favoritesCount,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get current user's favorites (populated)
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    return res.json(user.favorites);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Check if a given room is favorited by current user
exports.checkFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isFavorite = user.favorites.some(
      (f) => f.toString() === req.params.roomId,
    );
    return res.json({ isFavorite });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
