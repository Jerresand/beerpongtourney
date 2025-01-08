import connectDB from '@/lib/db';
import User from '@/models/User';

export interface UserProfile {
  facebookId: string;
  name: string;
  email: string;
  picture?: string;
}

export const userApi = {
  async createOrUpdateUser(userData: UserProfile) {
    try {
      await connectDB();
      
      const user = await User.findOneAndUpdate(
        { facebookId: userData.facebookId },
        {
          ...userData,
          lastLogin: new Date(),
        },
        { 
          new: true,
          upsert: true, // Create if doesn't exist
        }
      );

      return {
        success: true,
        data: user.toObject()
      };
    } catch (error) {
      console.error('Failed to create/update user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create/update user'
      };
    }
  },

  async getUser(facebookId: string) {
    try {
      await connectDB();
      const user = await User.findOne({ facebookId });
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        data: user.toObject()
      };
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user'
      };
    }
  }
}; 