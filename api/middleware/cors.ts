import { VercelRequest, VercelResponse } from '@vercel/node';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Vite's default dev port
  'https://www.beerpongtourney.com',
];

export function cors(handler: (req: VercelRequest, res: VercelResponse) => Promise<VercelResponse | void>) {
  return async (req: VercelRequest, res: VercelResponse) => {
    const origin = req.headers.origin;

    // Check if the origin is allowed
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Call the actual handler
    return handler(req, res);
  };
} 