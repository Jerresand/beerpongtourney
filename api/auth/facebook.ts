import { VercelRequest, VercelResponse } from '@vercel/node';
import connectDB from '../../src/lib/db';
import User from '../../src/models/User';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { facebookId, name, email, picture } = request.body;
    console.log('Received Facebook auth request:', { facebookId, name, email, picture });

    if (!facebookId || !name || !email) {
      console.error('Missing required fields:', { facebookId: !!facebookId, name: !!name, email: !!email });
      return response.status(400).json({ 
        success: false, 
        error: 'Missing required fields',
        details: { facebookId: !!facebookId, name: !!name, email: !!email }
      });
    }

    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB successfully');
    
    console.log('Attempting to create/update user:', { facebookId, name, email });
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
    console.log('User created/updated successfully:', user);

    return response.status(200).json({
      success: true,
      data: user.toObject()
    });
  } catch (error) {
    console.error('Failed to handle Facebook auth:', error);
    console.error('Full error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Internal server error';
    
    return response.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' 
        ? { stack: error instanceof Error ? error.stack : undefined }
        : undefined
    });
  }
} 