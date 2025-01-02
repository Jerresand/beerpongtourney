import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Tournament, Match, RegularMatch } from "@/types/tournament";
import { calculateStandings } from "@/utils/tournamentUtils";
import { generateRegularSeasonSchedule } from "@/utils/scheduleGenerator";
import MatchSchedule from "@/components/tournament/MatchSchedule";
import TeamView from "@/components/tournament/TeamView";
import StandingsTable from "@/components/tournament/Standings";
import { useToast } from "@/components/ui/use-toast";

interface RegularSeasonViewProps {
  tournament: Tournament;
}

const RegularSeasonView = ({ tournament }: RegularSeasonViewProps) => {
  const { toast } = useToast();
  const [showStandings, setShowStandings] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const [currentTournament, setCurrentTournament] = useState<Tournament>(tournament);
  const standings = calculateStandings(currentTournament);

  console.log('RegularSeasonView - Current Tournament:', currentTournament);
  console.log('RegularSeasonView - Regular Matches:', currentTournament.regularMatches);

  const handleGenerateSchedule = () => {
    const matchesPerCycle = currentTournament.players.length - 1;
    const cyclesNeeded = Math.ceil(currentTournament.matchesPerTeam / matchesPerCycle);

    const regularMatches = generateRegularSeasonSchedule(
      currentTournament.players,
      cyclesNeeded,
      currentTournament.format
    );

    const updatedTournament = {
      ...currentTournament,
      regularMatches
    };

    // Update localStorage
    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const updatedTournaments = tournaments.map((t: Tournament) =>
      t.id === tournament.id ? updatedTournament : t
    );
    localStorage.setItem("activeTournaments", JSON.stringify(updatedTournaments));

    setCurrentTournament(updatedTournament);

    toast({
      title: "Schedule Generated! 🎉",
      description: `${regularMatches.length} matches have been scheduled`,
    });
  };

  const handleTeamNameUpdate = (teamId: string, newName: string) => {
    const teamNames = JSON.parse(localStorage.getItem("tournamentTeamNames") || "{}");
    teamNames[`${tournament.id}-${teamId}`] = newName;
    localStorage.setItem("tournamentTeamNames", JSON.stringify(teamNames));
  };

  const handleMatchUpdate = (updatedMatch: Match) => {
    const updatedRegularMatch = updatedMatch as RegularMatch;
    
    const updatedMatches = currentTournament.regularMatches.map(match =>
      match.id === updatedRegularMatch.id ? updatedRegularMatch : match
    );

    const updatedTournament: Tournament = {
      ...currentTournament,
      regularMatches: updatedMatches
    };

    setCurrentTournament(updatedTournament);

    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const updatedTournaments = tournaments.map((t: Tournament) =>
      t.id === tournament.id ? updatedTournament : t
    );
    localStorage.setItem("activeTournaments", JSON.stringify(updatedTournaments));
  };

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        {currentTournament.format === "doubles" && (
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

      {(!currentTournament.regularMatches || currentTournament.regularMatches.length === 0) && (
        <Button
          variant="default"
          className="w-full h-24 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform transition-all hover:scale-105 animate-pulse mb-4"
          onClick={handleGenerateSchedule}
        >
          Generate Regular Season Schedule 🎉
        </Button>
      )}

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