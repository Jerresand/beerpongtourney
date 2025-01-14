import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
}

// Use the correct API URL based on environment
const API_URL = import.meta.env.DEV
  ? 'http://localhost:3000/api/auth.cjs'
  : '/api/auth.cjs';

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isGuest: false,

      login: async (email: string, password: string) => {
        try {
          console.log('Attempting login with:', { email });
          
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ action: 'login', email, password }),
            credentials: 'include',
          });

          console.log('Login response status:', response.status);

          if (!response.ok) {
            const error = await response.json();
            console.error('Login error response:', error);
            throw new Error(error.error || 'Failed to login');
          }

          const data = await response.json();
          console.log('Login success data:', data);
          
          set({
            token: data.token,
            user: data.user,
            isAuthenticated: true,
            isGuest: false,
          });
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },

      signup: async (name: string, email: string, password: string) => {
        try {
          console.log('Attempting signup with:', { name, email });
          
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ 
              action: 'signup',
              name,
              email,
              password 
            }),
            credentials: 'include',
          });

          console.log('Signup response status:', response.status);
          
          // Log the raw response text for debugging
          const responseText = await response.text();
          console.log('Raw response:', responseText);
          
          // Parse the response text as JSON
          let data;
          try {
            data = JSON.parse(responseText);
          } catch (e) {
            console.error('Failed to parse response as JSON:', e);
            throw new Error('Invalid response format from server');
          }

          if (!response.ok) {
            console.error('Signup error response:', data);
            throw new Error(data.error || 'Failed to sign up');
          }

          console.log('Signup success data:', data);
          
          set({
            token: data.token,
            user: data.user,
            isAuthenticated: true,
            isGuest: false,
          });
        } catch (error) {
          console.error('Signup error:', error);
          throw error;
        }
      },

      loginAsGuest: () => {
        set({
          token: null,
          user: {
            id: 'guest',
            name: 'Guest User',
            email: 'guest@example.com',
            preferences: {
              theme: 'dark',
              notifications: false,
              language: 'en'
            }
          },
          isAuthenticated: true,
          isGuest: true,
        });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isGuest: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
      }),
    }
  )
);