const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: [Number], required: true }, // [latitude, longitude]
  amenities: {
    wifi: { type: Boolean, default: false },
    furniture: { type: Boolean, default: false },
    tv: { type: Boolean, default: false },
    washingMachine: { type: Boolean, default: false },
    kitchen: { type: Boolean, default: false },
    refrigerator: { type: Boolean, default: false },
    airConditioner: { type: Boolean, default: false }
  },
  image: { type: String },
  area: { type: Number, required: true },
  available: { type: Boolean, default: true },
  phone: { type: String, required: true },
  ownerName: { type: String, required: true },
  verificationLevel: { type: String, enum: ['unverified', 'phone-verified', 'location-verified'], default: 'unverified' },
  verifiedAt: { type: Date },
  locationAccuracy: { type: Number },
  landlordId: { type: mongoose.Schema.Types.ObjectId, ref: 'Landlord' },
  pinInfo: {
    pinnedAt: { type: Date },
    pinnedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Landlord' },
    note: { type: String },
    photoAtPin: { type: String }
  },
  greenBadge: {
    level: { type: String, enum: ['none', 'verified'], default: 'none' },
    awardedAt: { type: Date },
    awardedBy: { type: String },
    inspectionNotes: { type: String }
  },
  views: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Property', PropertySchema);
