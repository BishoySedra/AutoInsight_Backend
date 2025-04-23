import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const mongo_username = process.env.MONGO_USERNAME;
    const mongo_password = process.env.MONGO_PASSWORD;
    const mongo_host = process.env.MONGO_HOST;
    const mongo_db = process.env.MONGO_DB;
    const mongo_url = `mongodb://${mongo_username}:${mongo_password}@localhost:27017/${mongo_db}?authSource=admin`;
    const local_url = `mongodb+srv://${mongo_username}:${mongo_password}@${mongo_host}/${mongo_db}?retryWrites=true&w=majority`;
    const url = `mongodb+srv://mazen:mazen@cluster0.devwr.mongodb.net/AutoInsights?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(url);
    console.log('MongoDB connected successfully!');
    

    // let connected_url = mongo_url;
    // if (connected_url === local_url) {
    //   await mongoose.connect(connected_url);
    //   console.log('MongoDB connected successfully locally!');
    // } else {
    //   await mongoose.connect(connected_url);
    //   console.log('MongoDB connected successfully on docker!');
    // }

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the app if DB connection fails
  }
};

export default connectDB;