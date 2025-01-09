import mongoose from 'mongoose';

// Define the type for our cached connection
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Use a simple object for caching
const cached: MongooseCache = {
  conn: null,
  promise: null
};

async function connectDB() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined in environment variables');
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  if (!cached.promise) {
    console.log('Creating new MongoDB connection...');
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('MongoDB connection established successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error('Failed to connect to MongoDB:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB; 