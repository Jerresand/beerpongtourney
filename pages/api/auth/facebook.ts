import type { VercelRequest, VercelResponse } from '@vercel/node';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accessToken } = req.body;

    // Verify token with Facebook
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to verify token with Facebook');
    }

    const userData = await response.json();

    // Connect to MongoDB
    await connectDB();

    // Find or create user
    let user = await User.findOne({ facebookId: userData.id }).exec();

    if (!user) {
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
      error: error instanceof Error ? error.message : 'Authentication failed' 
    });
  }
} 