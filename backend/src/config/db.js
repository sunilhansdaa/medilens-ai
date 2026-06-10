const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGO_URI is missing in environment variables"
      );
    }

    const connection = await mongoose.connect(mongoUri);

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error(
      `MongoDB connection failed: ${error.message}`
    );

    if (process.env.REQUIRE_MONGO === "true") {
      process.exit(1);
    }

    console.warn(
      "Continuing without MongoDB. Report database routes may not work until MongoDB is running."
    );
  }
};

module.exports = connectDB;