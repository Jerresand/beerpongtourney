// This module should only be imported in server-side code (API routes, server functions)
import mongoose from 'mongoose';

// Prevent usage in client-side code
if (typeof window !== 'undefined') {
  throw new Error('This module can only be used in server-side code');
}

// Server-side caching of the MongoDB connection
let cached = {
  conn: null as mongoose.Connection | null,
  promise: null as Promise<mongoose.Connection> | null
};

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const uri = process.env.VITE_MONGODB_URI;
    if (!uri) {
      throw new Error('MongoDB URI is required but not found in environment variables');
    }

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB; 