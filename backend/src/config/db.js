import mongoose from "mongoose";

/**
 * Connect to MongoDB.
 * Exits the process on failure so the app never starts in a broken state.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 7+ has these as defaults, but being explicit prevents
      // deprecation warnings if the driver version changes.
      serverSelectionTimeoutMS: 5000, // fail fast if Atlas / local is unreachable
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌  MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

// Re-emit Mongoose connection events so the logs stay useful in production.
mongoose.connection.on("disconnected", () =>
  console.warn("⚠️   MongoDB disconnected"),
);
mongoose.connection.on("reconnected", () =>
  console.log("🔄  MongoDB reconnected"),
);

export default connectDB;
