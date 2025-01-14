// @ts-check

const allowedOrigins = [
  'http://localhost:5173',  // Vite dev server
  'http://localhost:3000',  // Vercel dev server
  'http://localhost:8080',  // Alternative Vite port
  'https://www.beerpongtourney.com',
  'https://www.beerpongtourney.com/login',
  'https://beerpongtourney.vercel.app'
];

/**
 * @param {(req: import('@vercel/node').VercelRequest, res: import('@vercel/node').VercelResponse) => Promise<import('@vercel/node').VercelResponse | void>} handler
 */
function cors(handler) {
  /**
   * @param {import('@vercel/node').VercelRequest} req
   * @param {import('@vercel/node').VercelResponse} res
   */
  return async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    const origin = req.headers.origin;
    
    // Allow requests from allowed origins, Vercel preview deployments, or Lovable preview domains
    if (origin && (allowedOrigins.includes(origin) || origin.includes('vercel.app') || origin.includes('lovableproject.com'))) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Set other CORS headers
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    try {
      // Call the actual handler
      return await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

module.exports = { cors };