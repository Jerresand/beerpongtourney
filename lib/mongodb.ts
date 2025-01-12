import mongoose from 'mongoose';

// Add type declaration for global mongoose
declare global {
  var mongoose: { conn: any; promise: any } | undefined;
}

// Use globalThis instead of global for cross-platform compatibility
let cached = (globalThis as any).mongoose;

if (!cached) {
  cached = (globalThis as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MongoDB URI is not defined');

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
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