import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginDialog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic here
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userProfile", JSON.stringify({ email, name: email.split("@")[0] }));
    
    toast({
      title: "Welcome to BeerPongTourney! 🏆",
      description: "Successfully logged in!",
    });
    
    const from = (location.state as any)?.from?.pathname || "/";
    navigate(from, { replace: true });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-dashboard-text">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-dashboard-card text-dashboard-text">
        <DialogHeader>
          <DialogTitle className="text-white">Login to BeerPongTourney</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-dashboard-background-light"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-dashboard-background-light"
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;