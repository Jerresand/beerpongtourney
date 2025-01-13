// @ts-check
const mongoose = require('mongoose');

/** @type {string} */
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const opts = {
  bufferCommands: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

const cached = {
  /** @type {import('mongoose') | null} */
  conn: null,
  /** @type {Promise<import('mongoose')> | null} */
  promise: null,
};

/**
 * @returns {Promise<import('mongoose')>}
 */
async function connectDB() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new MongoDB connection...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Successfully connected to MongoDB');
      return mongoose;
    });
  }

  try {
    const client = await cached.promise;
    cached.conn = client;
    return client;
  } catch (error) {
    cached.promise = null;
    console.error('MongoDB connection error:', error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error);
    throw new Error('Failed to connect to MongoDB. Please check your connection string and network.');
  }
}

module.exports = {
  connectDB
}; 