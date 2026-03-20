const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    images: [{ type: String }],
    reply: { type: String },
    replyAt: { type: Date },
  },
  { timestamps: true },
);

// Update property rating after save
ReviewSchema.post("save", async function () {
  const Property = mongoose.model("Property");
  const reviews = await mongoose.model("Review").find({ propertyId: this.propertyId });
  const avgRating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  await Property.findByIdAndUpdate(this.propertyId, { rating: avgRating });
});

module.exports = mongoose.model("Review", ReviewSchema);
