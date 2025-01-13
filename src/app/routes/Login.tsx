import { useState } from "react";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, loginAsGuest } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, isLogin: boolean) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (isLogin) {
        await login(email, password);
        toast({ title: "Welcome back! 🎉" });
      } else {
        const name = formData.get('name') as string;
        await signup(name, email, password);
        toast({ title: "Welcome to BeerPongTourney! 🎉" });
      }
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Authentication failed',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    toast({ title: "Welcome! 👋" });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-dashboard-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-6 bg-[#1a1a1a] border-2 border-[#2c1810] shadow-2xl p-8 rounded-[2rem]">
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="p-3 bg-[#2c1810] rounded-[1rem]">
            <Trophy className="h-12 w-12 text-[#ffd700]" />
          </div>
          <h2 className="text-3xl font-bold text-white">BeerPongTourney</h2>
          <p className="text-gray-400">Get started with your tournament!</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#2c1810] p-1 rounded-[1rem]">
            <TabsTrigger value="login" className="data-[state=active]:bg-[#ffd700] data-[state=active]:text-black rounded-[0.8rem]">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-[#ffd700] data-[state=active]:text-black rounded-[0.8rem]">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="bg-[#2c1810] border-[#3d2419] focus:border-[#ffd700] text-white placeholder:text-gray-500 rounded-[0.8rem]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="bg-[#2c1810] border-[#3d2419] focus:border-[#ffd700] text-white placeholder:text-gray-500 rounded-[0.8rem]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-semibold h-11 rounded-[0.8rem]"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  required
                  className="bg-[#2c1810] border-[#3d2419] focus:border-[#ffd700] text-white placeholder:text-gray-500 rounded-[0.8rem]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="bg-[#2c1810] border-[#3d2419] focus:border-[#ffd700] text-white placeholder:text-gray-500 rounded-[0.8rem]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="Choose a password"
                  required
                  className="bg-[#2c1810] border-[#3d2419] focus:border-[#ffd700] text-white placeholder:text-gray-500 rounded-[0.8rem]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-semibold h-11 rounded-[0.8rem]"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-dashboard-accent/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#1a1a1a] px-2 text-gray-400">Or</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-dashboard-accent/20 hover:bg-dashboard-card/50 text-gray-300"
          onClick={handleGuestLogin}
        >
          Continue as Guest
        </Button>
      </Card>
    </div>
  );
}