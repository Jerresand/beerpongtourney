import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">
        Welcome back, {user?.name}!
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Add your dashboard content here */}
        <div className="p-6 bg-dashboard-card rounded-xl border border-dashboard-accent/20">
          <h2 className="text-xl font-semibold text-white mb-2">Quick Stats</h2>
          <p className="text-gray-400">Your tournament statistics will appear here.</p>
        </div>
      </div>
    </div>
  );
} 