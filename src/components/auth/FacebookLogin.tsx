import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import FacebookLogin from '@greatsumini/react-facebook-login';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface FacebookLoginButtonProps {
  onLoginSuccess?: () => void;
}

export const FacebookLoginButton = ({ onLoginSuccess }: FacebookLoginButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFBInitialized, setIsFBInitialized] = useState(false);

  useEffect(() => {
    // Check if FB SDK is initialized
    if (window.FB) {
      setIsFBInitialized(true);
    } else {
      // Listen for FB SDK initialization
      window.fbAsyncInit = function() {
        setIsFBInitialized(true);
      };
    }
  }, []);

  const handleFacebookLogin = async (response: any) => {
    if (response.accessToken) {
      try {
        console.log('FB Response:', { 
          id: response.id,
          name: response.name,
          email: response.email,
          picture: response.picture?.data?.url 
        });

        // Store the access token
        localStorage.setItem("fbAccessToken", response.accessToken);
        localStorage.setItem("isAuthenticated", "true");
        
        // Create or update user through Vercel API
        const apiResponse = await fetch('/api/auth/facebook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            facebookId: response.id,
            name: response.name,
            email: response.email,
            picture: response.picture?.data?.url,
          }),
        });

        console.log('API Response Status:', apiResponse.status);
        const result = await apiResponse.json();
        console.log('API Response Body:', result);

        if (!result.success) {
          throw new Error(result.error || 'Unknown error occurred');
        }

        // Store user profile info in localStorage for easy access
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
      } catch (error) {
        console.error('Failed to store user data:', error);
        console.error('Full error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          error
        });
        toast({
          variant: "destructive",
          title: "Login Error",
          description: error instanceof Error ? error.message : "Failed to store user data. Please try again.",
        });
      }
    }
  };

  if (!isFBInitialized) {
    return (
      <Button
        type="button"
        disabled
        className="w-full bg-[#1877F2] hover:bg-[#1877F2]/90 opacity-50"
      >
        Loading Facebook Login...
      </Button>
    );
  }

  return (
    <FacebookLogin
      appId={import.meta.env.VITE_FACEBOOK_APP_ID}
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