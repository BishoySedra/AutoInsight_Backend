import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false; // Singleton State

const connectDB = async () => {
  if (isConnected) {
    console.log("✅ MongoDB already connected. Reusing existing connection.");
    return mongoose.connection;
  }

  try {
    const {
      MONGO_USERNAME,
      MONGO_PASSWORD,
      MONGO_HOST,
      MONGO_DB,
      NODE_ENV,
    } = process.env;

    const isProd = NODE_ENV === "production";

    // In production, connect to the cloud host (Atlas or remote)
    const prodUrl = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB}-prod?retryWrites=true&w=majority`;

    // In development, connect to local MongoDB
    const devUrl = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB}-dev?authSource=admin`;

    // Choose the URL based on environment
    const mongoUrl = isProd ? prodUrl : devUrl;

    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `✅ MongoDB connected successfully ${isProd ? "to Production cluster" : "locally"}!`
    );

    isConnected = true;
    return mongoose.connection;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit app if DB connection fails
  }
};

export default connectDB;
