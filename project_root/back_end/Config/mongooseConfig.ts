import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
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