import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Tournament } from "@/types/tournament";
import { calculateStandings, Standing } from "@/utils/tournamentUtils";
import MatchSchedule from "@/components/tournament/MatchSchedule";
import TeamView from "@/components/tournament/TeamView";
import StandingsTable from "@/components/tournament/StandingsTable";

const TournamentView = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const [standings, setStandings] = useState<Standing[]>([]);

  useEffect(() => {
    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const tournament = tournaments.find((t: Tournament) => t.id === id);
    if (tournament) {
      setTournament(tournament);
      setStandings(calculateStandings(tournament));
    }
  }, [id]);

  const handleTeamNameUpdate = (teamId: string, newName: string) => {
    const teamNames = JSON.parse(localStorage.getItem("tournamentTeamNames") || "{}");
    teamNames[`${id}-${teamId}`] = newName;
    localStorage.setItem("tournamentTeamNames", JSON.stringify(teamNames));
  };

  if (!tournament) return <div>Tournament not found</div>;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">{tournament.name}</h2>
            <p className="text-dashboard-text mt-2">
              {tournament.format} - {tournament.type}
            </p>
          </div>
          <div className="flex gap-2">
            {tournament.format === "doubles" && (
              <Button
                variant="outline"
                onClick={() => {
                  setShowTeams(!showTeams);
                  setShowStatistics(false);
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                Teams
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setShowStatistics(!showStatistics);
                setShowTeams(false);
              }}
            >
              {showStatistics ? "Show Matches" : "Show Statistics"}
            </Button>
          </div>
        </div>

        {showTeams ? (
          <TeamView 
            matches={tournament.matches} 
            onTeamNameUpdate={handleTeamNameUpdate}
          />
        ) : showStatistics ? (
          <StandingsTable standings={standings} />
        ) : (
          <MatchSchedule matches={tournament.matches} />
        )}
      </div>
    </Layout>
  );
};

export default TournamentView;