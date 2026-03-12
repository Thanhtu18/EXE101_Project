require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

const { swaggerUi, swaggerSpec } = require("./config/swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/rooms", require("./routes/room.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/reports", require("./routes/report.routes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MapHome backend running on port ${PORT}`);
  console.log(
    `Swagger UI available at ${process.env.SWAGGER_URL || `http://localhost:${PORT}`}/api-docs`,
  );
});
