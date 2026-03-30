const Transaction = require("../models/Transaction");
const Subscription = require("../models/Subscription");
const User = require("../models/User");
const Notification = require("../models/Notification");

// POST /api/payments/create
const crypto = require("crypto");

// Helper to format date for VNPay
function formatDate(date) {
  const pad = (n) => (n < 10 ? `0${n}` : n);
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

// POST /api/payments/create
const createPayment = async (req, res) => {
  try {
    const { amount, description, planId } = req.body;
    let vnp_Params = {};
    const date = new Date();
    const createDate = formatDate(date);
    const orderId = "RE" + formatDate(date); // Unique order ID
    
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = process.env.VNP_TMN_CODE;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = description || `Thanh toán gói ${planId || "dịch vụ"}`;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100; // VNPay amount is already multiplied by 100
    vnp_Params["vnp_ReturnUrl"] = process.env.VNP_RETURN_URL;
    vnp_Params["vnp_IpAddr"] = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    vnp_Params["vnp_CreateDate"] = createDate;

    if (planId) vnp_Params["vnp_OrderInfo"] += `|${planId}|${req.user.id || req.user._id}`;

    // Sort params alphabetically by key
    const sortedParams = {};
    Object.keys(vnp_Params).sort().forEach(key => {
      sortedParams[key] = encodeURIComponent(vnp_Params[key]).replace(/%20/g, "+");
    });

    // Create HmacSHA512 hash
    const signData = Object.entries(sortedParams).map(([k, v]) => `${k}=${v}`).join("&");
    const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    
    const vnpUrl = `${process.env.VNP_URL}?${signData}&vnp_SecureHash=${signed}`;
    
    res.status(200).json({ url: vnpUrl });
  } catch (error) {
    console.error("[VNPay Error]:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/payments/callback
const paymentCallback = async (req, res) => {
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];
    
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    // Sort params alphabetically
    const sortedParams = {};
    Object.keys(vnp_Params).sort().forEach(key => {
      sortedParams[key] = encodeURIComponent(vnp_Params[key]).replace(/%20/g, "+");
    });

    const secretKey = process.env.VNP_HASH_SECRET;
    const signData = Object.entries(sortedParams).map(([k, v]) => `${k}=${v}`).join("&");
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    if (secureHash === signed) {
      const respCode = vnp_Params["vnp_ResponseCode"];
      const orderInfo = vnp_Params["vnp_OrderInfo"];
      const amount = vnp_Params["vnp_Amount"] / 100;
      const [desc, planId, userId] = orderInfo.split("|");

      const successUrl = `${frontendUrl}/payment-success?orderId=${vnp_Params["vnp_TxnRef"]}&amount=${amount}&planId=${planId || ""}&type=subscription`;
      const failureUrl = `${frontendUrl}/payment-failure?code=${respCode}`;

      if (respCode === "00") {
        // PAYMENT SUCCESS
        await Transaction.create({
          userId,
          amount,
          description: desc,
          status: "success",
          invoiceId: vnp_Params["vnp_TxnRef"],
          orderId: vnp_Params["vnp_TxnRef"],
          paymentMethod: "VNPay"
        });

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
              { planName: plan.name, status: "active", expiryDate, features: plan.features },
              { upsert: true, new: true }
            );

            if (planId === "pro") {
              await User.findByIdAndUpdate(userId, { verificationLevel: 3 });
            }
          }
        }

        await Notification.create({
          userId,
          title: "Thanh toán thành công",
          message: `Bạn đã nâng cấp thành công gói ${planId}. Mã GD: ${vnp_Params["vnp_TxnRef"]}`,
          type: "success"
        });

        return res.redirect(successUrl);
      } else {
        // PAYMENT FAILED
        if (userId) {
          await Transaction.create({
            userId,
            amount,
            description: desc + " (Thất bại)",
            status: "failed",
            invoiceId: vnp_Params["vnp_TxnRef"],
            orderId: vnp_Params["vnp_TxnRef"],
            paymentMethod: "VNPay"
          });
        }
        return res.redirect(failureUrl);
      }
    } else {
      return res.redirect(`${frontendUrl}/payment-failure?code=97`); // Checksum failed
    }
  } catch (error) {
    console.error("[VNPay Callback Error]:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPayment, paymentCallback };
