import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../lib/mongodb';
import { User } from '../models/User';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      console.error('No access token provided');
      return res.status(400).json({ success: false, error: 'No access token provided' });
    }

    console.log('Verifying token with Facebook...');
    // Verify token with Facebook
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );
    
    if (!response.ok) {
      const fbError = await response.text();
      console.error('Facebook verification failed:', fbError);
      throw new Error(`Failed to verify token with Facebook: ${fbError}`);
    }

    const userData = await response.json();
    console.log('Facebook user data received:', { id: userData.id, name: userData.name });

    console.log('Connecting to MongoDB...');
    // Connect to MongoDB
    try {
      await connectDB();
    } catch (dbError) {
      console.error('MongoDB connection failed:', dbError);
      throw new Error('Database connection failed');
    }

    // Find or create user
    let user = await User.findOne({ facebookId: userData.id }).exec();
    console.log('Existing user found:', !!user);

    if (!user) {
      console.log('Creating new user...');
      user = await new User({
        facebookId: userData.id,
        name: userData.name,
        email: userData.email,
        profilePicture: userData.picture?.data.url,
        preferences: {
          theme: 'dark',
          notifications: false,
          language: 'en'
        }
      }).save();
    }

    return res.status(200).json({ 
      success: true, 
      user: {
        id: user._id,
        facebookId: user.facebookId,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        preferences: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Facebook authentication error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication failed',
      details: error instanceof Error ? error.stack : undefined
    });
  }
} 