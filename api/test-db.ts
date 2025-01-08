import { VercelRequest, VercelResponse } from '@vercel/node';
import connectDB from '../src/lib/db';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    console.log('Testing MongoDB connection...');
    await connectDB();
    console.log('MongoDB connection successful!');
    return response.status(200).json({ success: true, message: 'MongoDB connection successful!' });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    return response.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to connect to MongoDB' 
    });
  }
} 