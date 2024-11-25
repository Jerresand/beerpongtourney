import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Beer, Facebook } from "lucide-react";
import FacebookLogin from 'react-facebook-login';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const responseFacebook = (response: any) => {
    if (response.accessToken) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userProfile", JSON.stringify(response));
      toast({
        title: "Welcome to the party! 🍻",
        description: `Cheers, ${response.name}!`,
      });
      navigate("/");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Facebook login failed",
      });
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-dashboard-card p-8 rounded-lg">
        <div className="flex flex-col items-center justify-center text-center">
          <Beer className="h-12 w-12 text-dashboard-accent mb-4" />
          <h2 className="text-2xl font-bold text-white">Welcome to Beer Dashboard</h2>
          <p className="text-dashboard-muted mt-2">Sign in with Facebook to start tracking your epic night!</p>
        </div>

        <div className="mt-8">
          <FacebookLogin
            appId="YOUR_FACEBOOK_APP_ID" // Replace with your Facebook App ID
            autoLoad={false}
            fields="name,email,picture"
            callback={responseFacebook}
            cssClass="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white py-2 px-4 rounded-lg transition-colors"
            icon={<Facebook className="w-5 h-5" />}
            textButton="Continue with Facebook"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;