import { VercelRequest, VercelResponse } from '@vercel/node';
import connectDB from '../../src/lib/db';
import User from '../../src/models/User';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { facebookId, name, email, picture } = request.body;

    if (!facebookId || !name || !email) {
      return response.status(400).json({ error: 'Missing required fields' });
    }

    await connectDB();
    
    const user = await User.findOneAndUpdate(
      { facebookId },
      {
        facebookId,
        name,
        email,
        picture,
        lastLogin: new Date(),
      },
      { 
        new: true,
        upsert: true,
      }
    );

    return response.status(200).json({
      success: true,
      data: user.toObject()
    });
  } catch (error) {
    console.error('Failed to handle Facebook auth:', error);
    return response.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
} 