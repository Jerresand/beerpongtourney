import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Tournament } from "@/types/tournament";
import { calculateStandings } from "@/utils/tournamentUtils";
import { generateRegularSeasonSchedule } from "@/utils/scheduleGenerator";
import MatchSchedule from "@/components/tournament/MatchSchedule";
import TeamView from "@/components/tournament/TeamView";
import StandingsTable from "@/components/tournament/Standings";
import { useToast } from "@/components/ui/use-toast";
import RegularSeasonView from "./RegularSeasonView";
import PlayoffView from "./PlayoffView";

const TournamentView = () => {
  const { toast } = useToast();
  const { id } = useParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const tournament = tournaments.find((t: Tournament) => t.id === id);
    setTournament(tournament || null);
  }, [id]);

  const handleGenerateSchedule = () => {
    if (!tournament) return;

    const regularMatches = generateRegularSeasonSchedule(
      tournament.players,
      tournament.matchesPerTeam,
      tournament.format
    );

    const updatedTournament = {
      ...tournament,
      regularMatches
    };

    // Update localStorage
    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const updatedTournaments = tournaments.map((t: Tournament) =>
      t.id === tournament.id ? updatedTournament : t
    );
    localStorage.setItem("activeTournaments", JSON.stringify(updatedTournaments));

    setTournament(updatedTournament);
    toast({
      title: "Schedule Generated! 🎉",
      description: `${regularMatches.length} matches have been scheduled`,
    });
  };

  if (!tournament) return <div>Tournament not found</div>;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white">{tournament.name}</h2>
            <p className="text-dashboard-text mt-2">
              {tournament.format} - {tournament.type}
            </p>
          </div>
          
          {tournament.regularMatches.length === 0 && (
            <Button
              variant="default"
              className="w-full h-24 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform transition-all hover:scale-105 animate-pulse"
              onClick={handleGenerateSchedule}
            >
              Generate Regular Season Schedule 🎉
            </Button>
          )}

          <div className="flex gap-2">
            {/* ... other buttons ... */}
          </div>
        </div>
        
        {tournament.currentPhase === "playoffs" ? (
          <PlayoffView tournament={tournament} />
        ) : (
          <RegularSeasonView tournament={tournament} />
        )}
      </div>
    </Layout>
  );
};

export default TournamentView;