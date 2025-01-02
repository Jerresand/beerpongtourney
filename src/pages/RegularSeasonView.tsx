import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Tournament, Match } from "@/types/tournament";
import { calculateStandings } from "@/utils/tournamentUtils";
import MatchSchedule from "@/components/tournament/MatchSchedule";
import TeamView from "@/components/tournament/TeamView";
import StandingsTable from "@/components/tournament/Standings";

interface RegularSeasonViewProps {
  tournament: Tournament;
}

const RegularSeasonView = ({ tournament }: RegularSeasonViewProps) => {
  const [showStandings, setShowStandings] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const [currentTournament, setCurrentTournament] = useState(tournament);
  const standings = calculateStandings(currentTournament);

  const handleTeamNameUpdate = (teamId: string, newName: string) => {
    const teamNames = JSON.parse(localStorage.getItem("tournamentTeamNames") || "{}");
    teamNames[`${tournament.id}-${teamId}`] = newName;
    localStorage.setItem("tournamentTeamNames", JSON.stringify(teamNames));
  };

  const handleMatchUpdate = (updatedMatch: Match) => {
    const updatedMatches = currentTournament.regularMatches.map(match =>
      match.id === updatedMatch.id ? updatedMatch : match
    );

    const updatedTournament = {
      ...currentTournament,
      regularMatches: updatedMatches
    };

    // Update local state
    setCurrentTournament(updatedTournament);

    // Update localStorage
    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const updatedTournaments = tournaments.map((t: Tournament) =>
      t.id === tournament.id ? updatedTournament : t
    );
    localStorage.setItem("activeTournaments", JSON.stringify(updatedTournaments));
  };

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        {tournament.format === "doubles" && (
          <Button
            variant="outline"
            onClick={() => {
              setShowTeams(!showTeams);
              setShowStandings(false);
            }}
          >
            <Users className="mr-2 h-4 w-4" />
            Teams
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => {
            setShowStandings(!showStandings);
            setShowTeams(false);
          }}
        >
          {showStandings ? "Show Matches" : "Standings"}
        </Button>
      </div>

      {showTeams ? (
        <TeamView 
          matches={currentTournament.regularMatches} 
          onTeamNameUpdate={handleTeamNameUpdate}
        />
      ) : showStandings ? (
        <StandingsTable standings={standings} />
      ) : (
        <MatchSchedule 
          matches={currentTournament.regularMatches} 
          onMatchUpdate={handleMatchUpdate}
        />
      )}
    </div>
  );
};

export default RegularSeasonView;