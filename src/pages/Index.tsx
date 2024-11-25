import Layout from "@/components/dashboard/Layout";
import MetricCard from "@/components/dashboard/MetricCard";
import Chart from "@/components/dashboard/Chart";
import { Users, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Welcome back!</h2>
          <p className="text-gray-400 mt-2">Here's what's happening with your store today.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value="$45,231"
            description="Total revenue this month"
            trend="up"
            icon={DollarSign}
          />
          <MetricCard
            title="New Customers"
            value="892"
            description="New customers this week"
            trend="up"
            icon={Users}
          />
          <MetricCard
            title="Total Orders"
            value="1,234"
            description="Orders this month"
            trend="down"
            icon={ShoppingCart}
          />
          <MetricCard
            title="Growth Rate"
            value="12.5%"
            description="Compared to last month"
            trend="up"
            icon={TrendingUp}
          />
        </div>

        <Chart />
      </div>
    </Layout>
  );
};

export default Index;