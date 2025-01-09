import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trophy } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleGuestLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    toast({
      title: "Welcome to BeerPongTourney! 🏆",
      description: "Let's get started!",
    });
    
    // Redirect to the attempted URL or default to home
    const from = (location.state as any)?.from?.pathname || "/";
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-dashboard-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-dashboard-card p-8 rounded-lg">
        <div className="flex flex-col items-center justify-center text-center">
          <Trophy className="h-12 w-12 text-dashboard-accent mb-4" />
          <h2 className="text-2xl font-bold text-white">Welcome to BeerPongTourney</h2>
          <p className="text-dashboard-muted mt-2">Get started with your tournament!</p>
        </div>

        <div className="mt-8">
          <Button 
            onClick={handleGuestLogin}
            className="w-full bg-dashboard-accent hover:bg-dashboard-accent/90"
          >
            Start Creating Tournaments
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;