import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const { user, setUser } = useUser();
  const { toast } = useToast();

  if (!user) return null;

  const handleThemeChange = (theme: 'light' | 'dark') => {
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        theme,
      },
    };
    setUser(updatedUser);
    localStorage.setItem('userProfile', JSON.stringify(updatedUser));
    toast({
      title: "Settings updated",
      description: "Your theme preference has been saved.",
    });
  };

  const handleNotificationsChange = (enabled: boolean) => {
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        notifications: enabled,
      },
    };
    setUser(updatedUser);
    localStorage.setItem('userProfile', JSON.stringify(updatedUser));
    toast({
      title: "Settings updated",
      description: `Notifications ${enabled ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleLanguageChange = (language: string) => {
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        language,
      },
    };
    setUser(updatedUser);
    localStorage.setItem('userProfile', JSON.stringify(updatedUser));
    toast({
      title: "Settings updated",
      description: "Your language preference has been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-dashboard-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-dashboard-muted mt-2">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="space-y-6 bg-dashboard-card p-6 rounded-lg">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Appearance</h2>
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={user.preferences?.theme || 'light'}
                onValueChange={(value: 'light' | 'dark') => handleThemeChange(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Enable notifications</Label>
              <Switch
                id="notifications"
                checked={user.preferences?.notifications || false}
                onCheckedChange={handleNotificationsChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Language</h2>
            <div className="flex items-center justify-between">
              <Label htmlFor="language">Display language</Label>
              <Select
                value={user.preferences?.language || 'en'}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-dashboard-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Account</h2>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <p className="text-sm text-dashboard-muted">
                {user.email}
              </p>
            </div>
            <div>
              <Label>Name</Label>
              <p className="text-sm text-dashboard-muted">
                {user.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 