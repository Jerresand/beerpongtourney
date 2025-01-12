import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserContextType } from '@/types/user';

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage on mount
    const loadUser = () => {
      const userProfile = localStorage.getItem('userProfile');
      const fbUserData = localStorage.getItem('fbUserData');
      
      if (userProfile) {
        try {
          const userData = JSON.parse(userProfile);
          const fbData = fbUserData ? JSON.parse(fbUserData) : null;
          
          setUser({
            id: userData.facebookId || 'guest',
            name: userData.name,
            profilePicture: userData.profilePicture,
            facebookId: userData.facebookId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('fbUserData');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 