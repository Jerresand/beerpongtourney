import { Beer, LogOut, Trophy, Plus, List, Book } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { icon: Beer, label: "Dashboard", path: "/" },
  { icon: Book, label: "Rules & Guide", path: "/rules" },
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
        <h1 className="text-2xl font-bold text-dashboard-text">BeerPongTourney</h1>
        <p className="text-sm text-dashboard-muted mt-1">Professional Beer Pong Tournament Creator</p>
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
        
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(
            "flex items-center space-x-3 w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            location.pathname.includes("/tournament")
              ? "bg-dashboard-background text-dashboard-text"
              : "text-dashboard-muted hover:text-dashboard-text hover:bg-dashboard-background"
          )}>
            <Trophy className="h-5 w-5" />
            <span>Tournaments</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => navigate("/tournament")}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Create Tournament</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/active-tournaments")}>
              <List className="mr-2 h-4 w-4" />
              <span>Active Tournaments</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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