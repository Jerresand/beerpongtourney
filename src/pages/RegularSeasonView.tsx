import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Tournament } from "@/types/tournament";
import { calculateStandings, Standing } from "@/utils/tournamentUtils";
import MatchSchedule from "@/components/tournament/MatchSchedule";
import TeamView from "@/components/tournament/TeamView";
import StandingsTable from "@/components/tournament/Standings";

interface RegularSeasonViewProps {
  tournament: Tournament;
}

const RegularSeasonView = ({ tournament }: RegularSeasonViewProps) => {
  const [showStatistics, setShowStatistics] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const standings = calculateStandings(tournament);

  const handleTeamNameUpdate = (teamId: string, newName: string) => {
    const teamNames = JSON.parse(localStorage.getItem("tournamentTeamNames") || "{}");
    teamNames[`${tournament.id}-${teamId}`] = newName;
    localStorage.setItem("tournamentTeamNames", JSON.stringify(teamNames));
  };

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
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

      {showTeams ? (
        <TeamView 
          matches={tournament.regularMatches} 
          onTeamNameUpdate={handleTeamNameUpdate}
        />
      ) : showStatistics ? (
        <StandingsTable standings={standings} />
      ) : (
        <MatchSchedule matches={tournament.regularMatches} />
      )}
    </div>
  );
};

export default RegularSeasonView;