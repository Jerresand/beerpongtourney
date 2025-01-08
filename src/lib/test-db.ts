import connectDB from './db';

export async function testMongoConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI:', import.meta.env.VITE_MONGODB_URI);
    const connection = await connectDB();
    console.log('MongoDB connection successful!');
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    return false;
  }
} 