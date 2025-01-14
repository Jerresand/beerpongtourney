// @ts-check
const { connectDB } = require('../api-lib/mongodb.cjs');
const { User } = require('../api-lib/models/User.cjs');
const jwt = require('jsonwebtoken');

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function connectWithRetry(retries = MAX_RETRIES) {
  try {
    await connectDB();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(retries - 1);
    }
    throw error;
  }
}

/**
 * @param {import('@vercel/node').VercelRequest} req
 * @param {import('@vercel/node').VercelResponse} res
 */
async function handler(req, res) {
  console.log('Auth API called with method:', req.method);
  console.log('Request body:', req.body);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Get the request origin
  const origin = req.headers.origin || '';
  console.log('Request origin:', origin);
  
  // Allow requests from localhost, Vercel deployments, and Lovable preview domains
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8080',
    'https://www.beerpongtourney.com',
    'https://beerpongtourney.vercel.app'
  ];
  
  // Also allow any Vercel preview deployment or Lovable preview domain
  if (origin.includes('vercel.app') || origin.includes('lovableproject.com')) {
    allowedOrigins.push(origin);
  }
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action } = req.body;
    console.log('Action:', action);
    
    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }

    // Connect to MongoDB with retry logic
    await connectWithRetry();

    if (action === 'signup') {
      const { name, email, password } = req.body;
      console.log('Processing signup for:', email);

      if (!name || !email || !password) {
        console.log('Missing required fields');
        return res.status(400).json({ error: 'All fields are required' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('Email already registered:', email);
        return res.status(400).json({ error: 'Email already registered' });
      }

      const user = await User.create({
        name,
        email,
        password,
        preferences: {
          theme: 'dark',
          notifications: false,
          language: 'en'
        }
      });

      console.log('User created successfully:', user._id);

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'fallback-secret-for-dev',
        { expiresIn: '7d' }
      );

      console.log('JWT token generated');

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferences: user.preferences
        }
      });
    }

    if (action === 'login') {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValid = await user.comparePassword(password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'fallback-secret-for-dev',
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferences: user.preferences
        }
      });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('API Error:', error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error);
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

module.exports = handler;