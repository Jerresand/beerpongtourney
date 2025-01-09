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
  picture?: {
    data: {
      url: string;
    };
  };
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
      
      // Get user info directly from Facebook Graph API
      const userResponse = await fetch(
        `https://graph.facebook.com/me?fields=id,name,picture&access_token=${accessToken}`
      );

      if (!userResponse.ok) {
        throw new Error('Failed to get user info from Facebook');
      }

      const userData: FacebookUserInfo = await userResponse.json();
      
      // For now, we'll store the user data in localStorage
      // In a real app, you'd want to store this in a backend database
      localStorage.setItem('fbUserData', JSON.stringify(userData));

      return { 
        success: true, 
        user: {
          facebookId: userData.id,
          name: userData.name,
          profilePicture: userData.picture?.data.url
        }
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      throw err;
    }
  };

  const logout = () => {
    window.FB.logout();
    localStorage.removeItem('fbUserData');
  };

  return { login, logout, isLoading, error };
} 