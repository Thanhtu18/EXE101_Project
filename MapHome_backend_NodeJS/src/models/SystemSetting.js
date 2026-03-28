const mongoose = require("mongoose");

const SystemSettingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "MapHome" },
    contactPhone: { type: String, default: "0123456789" },
    contactEmail: { type: String, default: "support@maphome.com" },
    maintenanceMode: { type: Boolean, default: false },
    pricing: {
      basicVerification: { type: Number, default: 0 },
      premiumVerification: { type: Number, default: 0 },
    },
    broadcastMessage: { type: String, default: "" },
    isBroadcastEnabled: { type: Boolean, default: false },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SystemSetting", SystemSettingSchema);
