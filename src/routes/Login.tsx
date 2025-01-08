import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trophy } from "lucide-react";
import { FacebookLoginButton } from "@/components/auth/FacebookLogin";

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
          <p className="text-dashboard-muted mt-2">Sign in to get started!</p>
        </div>

        <div className="mt-8 space-y-4">
          <FacebookLoginButton />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dashboard-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-dashboard-card px-2 text-dashboard-muted">Or continue with</span>
            </div>
          </div>

          <Button 
            onClick={handleGuestLogin}
            className="w-full bg-dashboard-accent hover:bg-dashboard-accent/90"
          >
            Continue as Guest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;