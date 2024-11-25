import Layout from "@/components/dashboard/Layout";
import MetricCard from "@/components/dashboard/MetricCard";
import Chart from "@/components/dashboard/Chart";
import { Beer, Users, GlassWater, CupSoda } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Let's get this party started! 🍻</h2>
          <p className="text-gray-400 mt-2">Track your epic night with the boys.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Beers Consumed"
            value="12"
            description="Total beers tonight"
            trend="up"
            icon={Beer}
          />
          <MetricCard
            title="The Boys"
            value="6"
            description="Legends present"
            trend="up"
            icon={Users}
          />
          <MetricCard
            title="Water Count"
            value="2"
            description="Stay hydrated kings"
            trend="up"
            icon={GlassWater}
          />
          <MetricCard
            title="Other Drinks"
            value="4"
            description="Mixed drinks & shots"
            trend="up"
            icon={CupSoda}
          />
        </div>

        <Chart />
      </div>
    </Layout>
  );
};

export default Index;