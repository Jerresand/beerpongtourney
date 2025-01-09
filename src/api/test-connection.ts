import connectDB from '../lib/mongodb';
import { User, IUser } from '../models/User';
import type { Document } from 'mongoose';

export async function testConnection() {
  try {
    await connectDB();
    
    const testUser = await new User({
      facebookId: 'test123',
      name: 'Test User',
      email: 'test@example.com',
    }).save();

    console.log('Test user created:', testUser);
    return { success: true, user: testUser };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 