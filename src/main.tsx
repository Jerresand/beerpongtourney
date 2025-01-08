import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { logEnvVars } from './lib/test-env';
import { testMongoConnection } from './lib/test-db';

// Log environment variables on startup
logEnvVars();

// Test MongoDB connection on startup
testMongoConnection().then(success => {
  if (success) {
    console.log('✅ MongoDB connection test passed');
  } else {
    console.error('❌ MongoDB connection test failed');
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
