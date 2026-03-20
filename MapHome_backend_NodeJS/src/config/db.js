const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    // Set a reasonable timeout for quick failure during development
    // If you want to force a specific database name, set DB_NAME in your .env
    const dbName = process.env.DB_NAME || undefined;
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:");
    console.error(error && error.stack ? error.stack : error);
    // Helpful hint for common Atlas issue
    console.error(
      "If this is an Atlas URI, make sure your current IP is whitelisted in Network Access and the user credentials are correct.",
    );
    process.exit(1);
  }
};

module.exports = connectDB;
