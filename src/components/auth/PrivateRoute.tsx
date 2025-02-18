import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(auth);
      setIsChecking(false);
    };
    
    checkAuth();
  }, [location.pathname]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;