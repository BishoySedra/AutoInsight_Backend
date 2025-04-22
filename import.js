import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import XLSX from 'xlsx';
import Review from './src/DB/models/review.js';

const connectDB = async () => {
  try {
    const mongo_username = process.env.MONGO_USERNAME;
    const mongo_password = process.env.MONGO_PASSWORD;
    const mongo_host = process.env.MONGO_HOST;
    const mongo_db = process.env.MONGO_DB;
    const mongo_url = `mongodb://${mongo_username}:${mongo_password}@localhost:27017/${mongo_db}?authSource=admin`;
    const local_url = `mongodb+srv://${mongo_username}:${mongo_password}@${mongo_host}/${mongo_db}?retryWrites=true&w=majority`;

    let connected_url = local_url;

    if (connected_url === local_url) {
      await mongoose.connect(connected_url);
      console.log('MongoDB connected successfully locally!');
    } else {
      await mongoose.connect(connected_url);
      console.log('MongoDB connected successfully on docker!');
    }

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the app if DB connection fails
  }
};

async function start() {
  await connectDB();
  const workbook = XLSX.readFile('Reviews.xlsx'); // replace with actual file
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  const validSentiments = ['positive', 'negative', 'neutral'];
  const reviewsWithUser = data.filter(item => item.review && validSentiments.includes(item.sentiment?.toLowerCase().trim()))
  .map(item => ({
    sentiment: item.sentiment?.toLowerCase().trim(),
    description: item.review.trim(),
    rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
    user_id: new mongoose.Types.ObjectId()
  }));
  
  try {
    const reviews = await Review.insertMany(reviewsWithUser);
    mongoose.disconnect();
  } catch (er) {
    console.error('Error:', er);
    mongoose.disconnect();
  }  
}
 


await start();