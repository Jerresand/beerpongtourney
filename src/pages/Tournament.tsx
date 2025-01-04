import Layout from "@/components/dashboard/Layout";
import TournamentCreator from "@/components/tournament/TournamentCreator";
import { useTournament } from "@/contexts/TournamentContext";
import MatchSchedule from "@/components/tournament/MatchSchedule";
import TeamView from "@/components/tournament/TeamView";

const Tournament = () => {
  const { tournament } = useTournament();
  console.log("Tournament page - tournament:", tournament);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Beerpong Tournament 🏆</h2>
          <p className="text-dashboard-text mt-2">Create and manage your tournaments.</p>
        </div>

        {!tournament ? (
          <TournamentCreator />
        ) : (
          <div className="space-y-6">
            <MatchSchedule />
            <TeamView />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tournament;