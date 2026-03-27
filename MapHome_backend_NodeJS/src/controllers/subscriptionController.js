const Subscription = require("../models/Subscription");

// @desc    Get current user's subscription
// @route   GET /api/subscriptions/me
const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user._id,
      status: "active",
    });
    if (!subscription) {
      return res.status(200).json({
        planName: "Free",
        status: "active",
        startDate: req.user.createdAt,
        expiryDate: null,
        features: ["5 tin đăng miễn phí"],
      });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available plans
// @route   GET /api/subscriptions/plans
const getAvailablePlans = async (req, res) => {
  try {
    const plans = [
      {
        id: "free",
        name: "Free",
        price: 0,
        listings: 5,
        features: ["5 tin đăng", "Hỗ trợ cộng đồng"],
      },
      {
        id: "standard",
        name: "Standard",
        price: 99000,
        listings: 20,
        features: ["20 tin đăng", "Hiển thị ưu tiên", "Hỗ trợ 24/7"],
      },
      {
        id: "pro",
        name: "Pro",
        price: 199000,
        listings: 50,
        features: ["50 tin đăng", "Hiển thị ưu tiên cao", "Thông báo SMS"],
      },
    ];
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Subscribe to a plan
// @route   POST /api/subscriptions/subscribe
const subscribe = async (req, res) => {
  try {
    const { planId } = req.body;
    // In a real app, this would be called after a successful payment callback
    // For now, we manually create/update the subscription
    const plans = {
      free: { name: "Free", features: ["5 tin đăng"] },
      standard: { name: "Standard", term: 30, features: ["20 tin đăng", "Ưu tiên"] },
      pro: { name: "Pro", term: 30, features: ["50 tin đăng", "Ưu tiên cao"] },
    };

    const plan = plans[planId];
    if (!plan) return res.status(400).json({ message: "Invalid plan" });

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (plan.term || 365));

    let subscription = await Subscription.findOne({ userId: req.user._id });

    if (subscription) {
      subscription.planName = plan.name;
      subscription.status = "active";
      subscription.expiryDate = expiryDate;
      subscription.features = plan.features;
      await subscription.save();
    } else {
      subscription = await Subscription.create({
        userId: req.user._id,
        planName: plan.name,
        expiryDate,
        features: plan.features,
      });
    }

    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMySubscription,
  getAvailablePlans,
  subscribe,
};
