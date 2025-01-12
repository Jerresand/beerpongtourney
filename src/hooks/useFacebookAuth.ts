import { useEffect, useState } from 'react';

interface FacebookAuthResponse {
  authResponse: {
    accessToken: string;
    expiresIn: string;
    reauthorize_required_in: string;
    signedRequest: string;
    userID: string;
  };
  status: 'connected' | 'not_authorized' | 'unknown';
}

interface FacebookUserInfo {
  id: string;
  name: string;
  email?: string;
  profilePicture?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    language?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  interface Window {
    FB: {
      init: (options: any) => void;
      login: (callback: (response: FacebookAuthResponse) => void, options: { scope: string }) => void;
      logout: () => void;
    };
    fbAsyncInit: () => void;
  }
}

export function useFacebookAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFacebookSDK = () => {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      window.fbAsyncInit = () => {
        window.FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        setIsLoading(false);
      };
    };

    loadFacebookSDK();
  }, []);

  const login = async () => {
    try {
      const response = await new Promise<FacebookAuthResponse>((resolve, reject) => {
        window.FB.login((fbResponse) => {
          if (fbResponse.authResponse) {
            resolve(fbResponse);
          } else {
            reject(new Error('User cancelled login or did not fully authorize.'));
          }
        }, { scope: 'public_profile' });
      });

      const { accessToken } = response.authResponse;
      
      // Call our API endpoint
      const apiResponse = await fetch('https://beerpongtourney.com/api/auth/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        console.error('Server authentication failed:', {
          status: apiResponse.status,
          statusText: apiResponse.statusText,
          error: errorData
        });
        throw new Error(`Failed to authenticate with server: ${apiResponse.status} ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store user data in localStorage
      localStorage.setItem('userProfile', JSON.stringify(data.user));

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      throw err;
    }
  };

  const logout = () => {
    window.FB.logout();
    localStorage.removeItem('userProfile');
  };

  return { login, logout, isLoading, error };
} 