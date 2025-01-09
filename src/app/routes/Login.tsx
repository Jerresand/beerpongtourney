import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trophy } from "lucide-react";
import { useFacebookAuth } from "@/hooks/useFacebookAuth";

// In your component:


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, isLoading } = useFacebookAuth();

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

  const handleFacebookLogin = async () => {
    try {
      const response = await login();
      if (response.success) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userProfile", JSON.stringify(response.user));
        toast({
          title: "Welcome to BeerPongTourney! 🏆",
          description: "Successfully logged in with Facebook!",
        });
        const from = (location.state as any)?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Could not log in with Facebook. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Error",
        description: error instanceof Error ? error.message : "An error occurred during login",
      });
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-dashboard-card p-8 rounded-lg">
        <div className="flex flex-col items-center justify-center text-center">
          <Trophy className="h-12 w-12 text-dashboard-accent mb-4" />
          <h2 className="text-2xl font-bold text-white">Welcome to BeerPongTourney</h2>
          <p className="text-dashboard-muted mt-2">Get started with your tournament!</p>
        </div>

        <div className="mt-8 space-y-4">
          <Button 
            onClick={handleFacebookLogin}
            className="w-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Continue with Facebook"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dashboard-muted"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dashboard-card text-dashboard-muted">Or</span>
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