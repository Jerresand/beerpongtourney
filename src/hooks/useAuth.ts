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

const API_URL = import.meta.env.DEV 
  ? 'http://localhost:3000'
  : 'https://www.beerpongtourney.com';

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isGuest: false,

      login: async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/api/auth?action=login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to login');
        }

        const data = await response.json();
        set({
          token: data.token,
          user: data.user,
          isAuthenticated: true,
          isGuest: false,
        });
      },

      signup: async (name: string, email: string, password: string) => {
        const response = await fetch(`${API_URL}/api/auth?action=signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
          credentials: 'include',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to sign up');
        }

        const data = await response.json();
        set({
          token: data.token,
          user: data.user,
          isAuthenticated: true,
          isGuest: false,
        });
      },

      loginAsGuest: () => {
        set({
          token: null,
          user: null,
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