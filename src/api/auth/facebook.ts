import connectDB from '../../lib/mongodb';
import { User } from '../../models/User';
import type { FilterQuery } from 'mongoose';

interface FacebookUserInfo {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

export async function facebookAuth(accessToken: string) {
  try {
    // Verify token with Facebook
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to verify token with Facebook');
    }

    const userData: FacebookUserInfo = await response.json();

    // Connect to MongoDB
    await connectDB();

    // Find or create user
    const filter: FilterQuery<typeof User> = { facebookId: userData.id };
    let user = await User.findOne(filter).exec();

    if (!user) {
      user = await new User({
        facebookId: userData.id,
        name: userData.name,
        email: userData.email,
        profilePicture: userData.picture?.data.url,
      }).save();
    }

    return { success: true, user };
  } catch (error) {
    console.error('Facebook authentication error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication failed' 
    };
  }
} 