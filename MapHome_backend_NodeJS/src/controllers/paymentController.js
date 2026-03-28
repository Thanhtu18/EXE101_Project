const Transaction = require("../models/Transaction");
const Subscription = require("../models/Subscription");
const User = require("../models/User");
const Notification = require("../models/Notification");

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
    const { status, userId, planId, orderId, amount, description } = req.query;
    
    if (status === "success" && userId) {
      // Record transaction
      await Transaction.create({
        userId,
        amount: Number(amount) || 0,
        description: description || `Thanh toán gói ${planId}`,
        status: "success",
        invoiceId: orderId || "INV-" + Date.now(),
        orderId: orderId || "ORD-" + Date.now(),
        paymentMethod: "VNPay"
      });

      // Update user subscription level (simple version)
      if (planId) {
        const plans = {
          standard: { name: "Standard", term: 30, features: ["20 tin đăng", "Ưu tiên"] },
          pro: { name: "Pro", term: 30, features: ["50 tin đăng", "Ưu tiên cao"] },
        };
        const plan = plans[planId];
        if (plan) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);
          
          await Subscription.findOneAndUpdate(
            { userId },
            { 
              planName: plan.name, 
              status: "active", 
              expiryDate, 
              features: plan.features 
            },
            { upsert: true, new: true }
          );

          if (planId === "pro") {
            await User.findByIdAndUpdate(userId, { verificationLevel: 3 });
          }
        }
      }

      // Create notification for user
      await Notification.create({
        userId,
        title: "Thanh toán thành công",
        message: `Bạn đã thanh toán thành công gói ${planId || "dịch vụ"}. Hóa đơn: ${orderId || "N/A"}.`,
        type: "success"
      });
    } else if (status === "success" === false && userId) {
       // Record failed transaction
       await Transaction.create({
        userId,
        amount: Number(amount) || 0,
        description: description || `Thanh toán gói ${planId} thất bại`,
        status: "failed",
        invoiceId: orderId || "INV-" + Date.now(),
        orderId: orderId || "ORD-" + Date.now(),
        paymentMethod: "VNPay"
      });
    }

    res.status(200).json({ message: "Callback processed", status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPayment, paymentCallback };
