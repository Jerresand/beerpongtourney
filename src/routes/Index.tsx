import Layout from "@/components/dashboard/Layout";
import GroupCreator from "@/components/dashboard/GroupCreator";
import { Trophy, Plus, List, Crown, Medal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tournament } from "@/types/tournament";

interface LeaderStats {
  tournamentName: string;
  topTeam: {
    name: string;
    wins: number;
    losses: number;
  } | null;
  topPlayer: {
    name: string;
    cups: number;
  } | null;
  totalBeers: number;
}

const Index = () => {
  const navigate = useNavigate();
  const [hasActiveTournaments, setHasActiveTournaments] = useState(false);
  const [leaders, setLeaders] = useState<LeaderStats | null>(null);

  useEffect(() => {
    const tournaments = JSON.parse(localStorage.getItem('activeTournaments') || '[]') as Tournament[];
    setHasActiveTournaments(tournaments.length > 0);

    // Find most recently visited tournament
    if (tournaments.length > 0) {
      const mostRecent = tournaments.reduce((latest, current) => {
        if (!latest.lastVisited) return current;
        if (!current.lastVisited) return latest;
        return new Date(current.lastVisited) > new Date(latest.lastVisited) ? current : latest;
      });

      if (mostRecent) {
        // Calculate total cups for this tournament
        const totalCups = mostRecent.players.reduce((sum, player) => 
          sum + (player.stats?.totalCups || 0), 0
        );

        // Find top team
        const topTeam = mostRecent.teams.reduce((best, current) => {
          const currentWinRate = (current.stats?.wins || 0) / (current.stats?.gamesPlayed || 1);
          const bestWinRate = (best.stats?.wins || 0) / (best.stats?.gamesPlayed || 1);
          return currentWinRate > bestWinRate ? current : best;
        }, mostRecent.teams[0]);

        // Find top player
        const topPlayer = mostRecent.players.reduce((best, current) => {
          return (current.stats?.totalCups || 0) > (best.stats?.totalCups || 0) ? current : best;
        }, mostRecent.players[0]);

        setLeaders({
          tournamentName: mostRecent.name,
          topTeam: topTeam ? {
            name: topTeam.name,
            wins: topTeam.stats?.wins || 0,
            losses: topTeam.stats?.losses || 0
          } : null,
          topPlayer: topPlayer ? {
            name: topPlayer.name,
            cups: topPlayer.stats?.totalCups || 0
          } : null,
          totalBeers: Math.ceil(totalCups / 3)
        });
      }
    }
  }, []);

  return (
    <Layout>
      <Tabs defaultValue="dashboard" className="space-y-8">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="groups">Create Group</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Welcome to BeerPongTourney! 🏆</h2>
            <p className="text-gray-400 mt-2">Create or join a tournament to get started.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Button
              onClick={() => navigate("/tournament")}
              className="h-32 text-xl bg-dashboard-accent hover:bg-dashboard-accent/90 flex items-center justify-center gap-3"
            >
              <Plus className="h-6 w-6" />
              Create Tournament
            </Button>
            
            {hasActiveTournaments && (
              <Button
                onClick={() => navigate("/active-tournaments")}
                className="h-32 text-xl bg-green-600 hover:bg-green-700 flex items-center justify-center gap-3"
              >
                <List className="h-6 w-6" />
                View Active Tournaments
              </Button>
            )}
          </div>

          {leaders && (
            <div className="grid gap-6 md:grid-cols-2">
              {leaders.topTeam && (
                <div className="bg-dashboard-card rounded-lg p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <Crown className="h-12 w-12 text-[#FFD700]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Leading Team</h3>
                  <div className="text-3xl font-bold text-dashboard-accent mb-2">
                    {leaders.topTeam.name}
                  </div>
                  <p className="text-gray-400">
                    {leaders.topTeam.wins}W - {leaders.topTeam.losses}L
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    in {leaders.tournamentName}
                  </p>
                </div>
              )}

              {leaders.topPlayer && (
                <div className="bg-dashboard-card rounded-lg p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <Medal className="h-12 w-12 text-[#FFD700]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Cup Leader</h3>
                  <div className="text-3xl font-bold text-dashboard-accent mb-2">
                    {leaders.topPlayer.name}
                  </div>
                  <p className="text-gray-400">
                    {leaders.topPlayer.cups} cups
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    in {leaders.tournamentName}
                  </p>
                </div>
              )}
            </div>
          )}

          {leaders && leaders.totalBeers > 0 && (
            <div className="bg-dashboard-card rounded-lg p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-4">Tournament Beers Consumed 🍺</h3>
              <div className="text-7xl font-bold text-dashboard-accent">
                {leaders.totalBeers}
              </div>
              <p className="text-gray-400 mt-2">beers in {leaders.tournamentName}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="groups">
          <div className="max-w-2xl mx-auto">
            <GroupCreator />
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Index;