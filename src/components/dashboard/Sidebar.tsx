import { Beer, Users, CupSoda, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const menuItems = [
  { icon: Beer, label: "Dashboard", path: "/" },
  { icon: Users, label: "The Boys", path: "/boys" },
  { icon: CupSoda, label: "Drink Log", path: "/drinks" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userProfile");
    toast({
      title: "See you next time! 🍻",
      description: "Successfully logged out",
    });
    navigate("/login");
  };

  return (
    <div className="hidden md:flex h-screen w-64 flex-col bg-dashboard-card border-r border-dashboard-accent/20 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dashboard-text">Beer Dashboard</h1>
      </div>
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex items-center space-x-3 w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              location.pathname === item.path
                ? "bg-dashboard-background text-dashboard-text"
                : "text-dashboard-muted hover:text-dashboard-text hover:bg-dashboard-background"
            )}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg text-sm font-medium text-dashboard-muted hover:text-dashboard-text hover:bg-dashboard-background transition-colors"
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;