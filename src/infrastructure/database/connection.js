import mongoose from 'mongoose';
import config from '../../config/env.js';

const connectDB = async () => {
  try {
    await mongoose.connect(config.DB_URL);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

export default connectDB;
