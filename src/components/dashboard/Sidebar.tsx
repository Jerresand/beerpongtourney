import { Beer, Users, CupSoda, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Beer, label: "Dashboard", active: true },
  { icon: Users, label: "The Boys" },
  { icon: CupSoda, label: "Drink Log" },
  { icon: Settings, label: "Settings" },
];

const Sidebar = () => {
  return (
    <div className="hidden md:flex h-screen w-64 flex-col bg-dashboard-background p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Beer Dashboard</h1>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={cn(
              "flex items-center space-x-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              item.active
                ? "bg-dashboard-accent text-white"
                : "text-gray-400 hover:bg-dashboard-card hover:text-white"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;