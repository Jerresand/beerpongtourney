import mongoose from 'mongoose';

// Add type declaration for global mongoose
declare global {
  var mongoose: { conn: any; promise: any } | undefined;
}

if (!import.meta.env.VITE_MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
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

    cached.promise = mongoose.connect(import.meta.env.VITE_MONGODB_URI, opts).then((mongoose) => {
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