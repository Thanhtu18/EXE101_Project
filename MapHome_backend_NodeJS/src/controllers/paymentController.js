// Payment stubs (VNPay integration points)
// Real integration requires VNPay credentials and server-side signature handling.

// POST /api/payments/create
const createPayment = async (req, res) => {
  try {
    const { amount, description, orderId } = req.body;
    // For now return a dummy VNPay redirect URL that frontend can use for testing
    const redirectUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?amount=${amount}&orderId=${orderId || "test-" + Date.now()}`;
    res.status(200).json({ url: redirectUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/payments/callback
const paymentCallback = async (req, res) => {
  try {
    const { status, userId, planId, orderId } = req.query;
    
    if (status === "success" && userId) {
      const User = require("../models/User");
      const Notification = require("../models/Notification");
      
      // Update user subscription (mock logic)
      await User.findByIdAndUpdate(userId, { 
        verificationLevel: planId === "pro" ? 2 : 1 
      });

      // Create notification for user
      await Notification.create({
        userId,
        title: "Thanh toán thành công",
        message: `Bạn đã thanh toán thành công gói ${planId || "dịch vụ"}. Hóa đơn: ${orderId || "N/A"}.`,
        type: "success"
      });
    }

    res.status(200).json({ message: "Callback processed", status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPayment, paymentCallback };
