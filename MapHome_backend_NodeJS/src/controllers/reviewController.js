const Review = require("../models/Review");
const Property = require("../models/Property");

// @desc    Get all reviews for a property
// @route   GET /api/reviews/property/:propertyId
const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.propertyId })
      .populate("userId", "username fullName avatar")
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { propertyId, rating, comment, images } = req.body;
    
    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    // Check if user already reviewed
    const existing = await Review.findOne({ propertyId, userId: req.user._id });
    if (existing) return res.status(400).json({ message: "You have already reviewed this property" });

    const review = await Review.create({
      propertyId,
      userId: req.user._id,
      rating,
      comment,
      images: images || [],
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
const updateReview = async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found or unauthorized" });
    
    // Trigger rating re-calc if rating changed (handled by model middleware mostly but let's be safe)
    await review.save(); 

    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Review removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reply to a review (Landlord only)
// @route   PUT /api/reviews/:id/reply
const replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    const review = await Review.findById(req.params.id).populate("propertyId");
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check if the user is the landlord of the property
    if (String(review.propertyId.landlordId) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to reply to this review" });
    }

    review.reply = reply;
    review.replyAt = new Date();
    await review.save();

    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get latest five-star reviews for landing page
// @route   GET /api/reviews/latest
const getLatestReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ rating: 5 })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("userId", "username avatar fullName role")
      .populate("propertyId", "name");

    const testimonials = reviews.map((r) => ({
      id: r._id,
      name: r.userId?.fullName || r.userId?.username || "Ẩn danh",
      role: r.userId?.role === "landlord" ? "Chủ trọ" : "Người thuê",
      text: r.comment,
      rating: r.rating,
      avatar: r.userId?.fullName?.charAt(0) || "U",
    }));

    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPropertyReviews,
  createReview,
  updateReview,
  deleteReview,
  replyToReview,
  getLatestReviews,
};
