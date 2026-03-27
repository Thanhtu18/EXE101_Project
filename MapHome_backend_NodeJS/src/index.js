const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const path = require("path");

// Load env vars
dotenv.config();
// Connect to database and then start server
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/landlords", require("./routes/landlordRoutes"));
app.use("/api/landlord", require("./routes/landlordDashboardRoutes"));
app.use("/api/verifications", require("./routes/verificationRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/subscriptions", require("./routes/subscriptionRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));



app.get("/", (req, res) => res.send("API is running..."));

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(err && err.status ? err.status : 500).json({
    message: err && err.message ? err.message : "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

(async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`📚 Swagger API Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error && error.stack ? error.stack : error,
    );
    process.exit(1);
  }
})();
