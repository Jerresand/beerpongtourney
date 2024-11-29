import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  trend?: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
}

const MetricCard = ({ title, value, description, trend, icon: Icon }: MetricCardProps) => {
  return (
    <Card className="bg-dashboard-card border-2 border-dashboard-accent/20 p-6 backdrop-blur-sm backdrop-filter">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-dashboard-muted">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-dashboard-text">{value}</h3>
        </div>
        <Icon className="h-8 w-8 text-dashboard-accent" />
      </div>
      <p className="mt-4 text-sm text-dashboard-muted">{description}</p>
      {trend && (
        <div
          className={cn(
            "mt-2 text-sm font-medium",
            trend === "up" ? "text-green-400" : "text-red-400"
          )}
        >
          {trend === "up" ? "↑" : "↓"} {trend === "up" ? "+2.5%" : "-1.5%"}
        </div>
      )}
    </Card>
  );
};

export default MetricCard;