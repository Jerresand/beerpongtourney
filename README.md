# BeerPongTourney

A tournament management system for beer pong competitions.

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your credentials:
- `VITE_FACEBOOK_APP_ID`: Your Facebook App ID
- `VITE_MONGODB_URI`: Your MongoDB connection string
  - Use a strong password
  - Include your IP address in MongoDB Atlas IP whitelist
  - Format: `mongodb+srv://username:password@your-cluster.mongodb.net/?retryWrites=true&w=majority`

3. Security Best Practices:
- Never commit `.env` file to version control
- Use a strong, unique password for MongoDB
- Enable IP whitelisting in MongoDB Atlas
- Regularly rotate credentials
- Keep your Facebook App ID private

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Production

When deploying to Vercel:
1. Add environment variables in Vercel dashboard
2. Enable IP whitelist for Vercel's IP ranges in MongoDB Atlas
