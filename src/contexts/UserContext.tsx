import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id?: string;
  name: string;
  email: string;
  profilePicture?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    language?: string;
  };
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userProfile");
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
} 