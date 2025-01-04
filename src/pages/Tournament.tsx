import Layout from "@/components/dashboard/Layout";
import TournamentCreator from "@/components/tournament/TournamentCreator";
import { useTournament } from "@/contexts/TournamentContext";
import MatchSchedule from "@/components/tournament/MatchSchedule";
import TeamView from "@/components/tournament/TeamView";

const Tournament = () => {
  const { tournament, updateTournament } = useTournament();
  console.log("Tournament page - tournament:", tournament);

  const handleTeamNameUpdate = (teamId: string, newName: string) => {
    if (!tournament) return;
    
    const updatedTournament = {
      ...tournament,
      teams: tournament.teams?.map(team => 
        team.id === teamId ? { ...team, name: newName } : team
      )
    };
    updateTournament(updatedTournament);
  };

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
            <TeamView 
              matches={tournament.regularMatches}
              onTeamNameUpdate={handleTeamNameUpdate}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tournament;