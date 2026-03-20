const mongoose = require('mongoose');

const LandlordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String },
  totalListings: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  responseRate: { type: Number, default: 0 },
  responseTime: { type: String },
  joinedDate: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Landlord', LandlordSchema);
