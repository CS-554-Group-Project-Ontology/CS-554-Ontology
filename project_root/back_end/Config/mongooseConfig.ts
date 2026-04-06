import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()
const connectDB = async () => {
  try {
    const url = process.env.MONGO_URL;
    if (!url){
      throw new Error("Mongo DB Connection Failed")
    }
    await mongoose.connect(url);
    console.log('MongoDB Connected...');
  } catch (err) {
    if (err instanceof Error){
      console.error(err.message);
    }
    else{
      console.error('Unknown Error', err);
    }
    process.exit(1);
  }
};

export default connectDB;