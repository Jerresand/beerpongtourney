export function logEnvVars() {
  console.log('MongoDB URI:', import.meta.env.VITE_MONGODB_URI ? 'Found' : 'Not found');
  console.log('Facebook App ID:', import.meta.env.VITE_FACEBOOK_APP_ID ? 'Found' : 'Not found');
} 