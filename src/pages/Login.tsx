import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Beer } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    toast({
      title: "Welcome to the party! 🍻",
      description: "Let's get started!",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-dashboard-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-dashboard-card p-8 rounded-lg">
        <div className="flex flex-col items-center justify-center text-center">
          <Beer className="h-12 w-12 text-dashboard-accent mb-4" />
          <h2 className="text-2xl font-bold text-white">Welcome to BeerAdmin</h2>
          <p className="text-dashboard-muted mt-2">Click below to enter!</p>
        </div>

        <div className="mt-8">
          <Button 
            onClick={handleLogin}
            className="w-full bg-dashboard-accent hover:bg-dashboard-accent/90"
          >
            Enter BeerAdmin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;