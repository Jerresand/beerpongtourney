import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import FacebookLogin from '@greatsumini/react-facebook-login';
import { Button } from "@/components/ui/button";

interface FacebookLoginButtonProps {
  onLoginSuccess?: () => void;
}

export const FacebookLoginButton = ({ onLoginSuccess }: FacebookLoginButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFacebookLogin = (response: any) => {
    if (response.accessToken) {
      // Store the access token and user info
      localStorage.setItem("fbAccessToken", response.accessToken);
      localStorage.setItem("isAuthenticated", "true");
      
      // Store user profile info
      const userProfile = {
        id: response.id,
        name: response.name,
        email: response.email,
        picture: response.picture?.data?.url,
      };
      localStorage.setItem("userProfile", JSON.stringify(userProfile));

      toast({
        title: `Welcome ${response.name}! 🏆`,
        description: "Successfully logged in with Facebook",
      });

      onLoginSuccess?.();
      navigate("/");
    }
  };

  return (
    <FacebookLogin
      appId={process.env.VITE_FACEBOOK_APP_ID || ""}
      onSuccess={handleFacebookLogin}
      onFail={(error) => {
        console.error("Facebook login failed:", error);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Could not login with Facebook. Please try again.",
        });
      }}
      render={({ onClick }) => (
        <Button
          type="button"
          onClick={onClick}
          className="w-full bg-[#1877F2] hover:bg-[#1877F2]/90"
        >
          Continue with Facebook
        </Button>
      )}
    />
  );
}; 