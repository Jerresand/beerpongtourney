import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Beer } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, accept any email/password
    if (email && password) {
      localStorage.setItem("isAuthenticated", "true");
      toast({
        title: "Welcome to the party! 🍻",
        description: "Successfully logged in",
      });
      navigate("/");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-dashboard-card p-8 rounded-lg">
        <div className="flex flex-col items-center justify-center text-center">
          <Beer className="h-12 w-12 text-dashboard-accent mb-4" />
          <h2 className="text-2xl font-bold text-white">Welcome to Beer Dashboard</h2>
          <p className="text-dashboard-muted mt-2">Sign in to start tracking your epic night!</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-dashboard-background text-white"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-dashboard-background text-white"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-dashboard-accent hover:bg-dashboard-accent/90">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;