import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/dashboard/Layout";
import { Tournament } from "@/types/tournament";
import RegularSeasonView from "@/components/tournament/RegularSeasonView";
import EnterPlayoffView from "@/components/tournament/EnterPlayoffView";
import PlayoffView from "@/components/tournament/PlayoffView";
import TeamView from "@/components/tournament/TeamView";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";

const TournamentView = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [showTeamView, setShowTeamView] = useState(false);

  // Load tournament data
  useEffect(() => {
    const loadTournament = () => {
      const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
      const tournament = tournaments.find((t: Tournament) => t.id === id);
      setTournament(tournament || null);
    };

    loadTournament();

    // Add storage event listener to update when localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "activeTournaments") {
        loadTournament();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [id]);

  const handleTeamNameUpdate = (teamId: string, newName: string) => {
    if (!tournament) return;

    const updatedTournament = {
      ...tournament,
      teams: tournament.teams.map(team =>
        team.id === teamId ? { ...team, name: newName } : team
      )
    };

    // Update localStorage
    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const updatedTournaments = tournaments.map((t: Tournament) =>
      t.id === tournament.id ? updatedTournament : t
    );
    localStorage.setItem("activeTournaments", JSON.stringify(updatedTournaments));

    setTournament(updatedTournament);
  };

  const handleTournamentUpdate = (updatedTournament: Tournament) => {
    setTournament(updatedTournament);
  };

  // Check if all regular season games are completed
  const areAllGamesPlayed = () => {
    if (!tournament) return false;
    return tournament.regularMatches.every(match => 
      match.team1Score !== undefined && 
      match.team2Score !== undefined && 
      (match.team1Score > 0 || match.team2Score > 0)  // At least one team must have scored
    );
  };

  const handleStartPlayoffs = () => {
    if (!tournament || !areAllGamesPlayed()) return;
    
    const updatedTournament: Tournament = {
      ...tournament,
      currentPhase: "playoffs" as const
    };

    // Update localStorage
    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const updatedTournaments = tournaments.map((t: Tournament) =>
      t.id === tournament.id ? updatedTournament : t
    );
    localStorage.setItem("activeTournaments", JSON.stringify(updatedTournaments));

    setTournament(updatedTournament);
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
            <Button
              onClick={() => setShowTeamView(true)}
              className="bg-dashboard-accent text-black hover:bg-dashboard-highlight"
            >
              Edit Teams
            </Button>
            {tournament.currentPhase === "playoffs" ? (
              <Button
                onClick={() => {
                  const updatedTournament: Tournament = {
                    ...tournament,
                    currentPhase: "regular" as const
                  };
                  handleTournamentUpdate(updatedTournament);
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Regular Season
              </Button>
            ) : (
              <Button
                disabled={!areAllGamesPlayed()}
                onClick={handleStartPlayoffs}
                className={`${
                  areAllGamesPlayed() 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-gray-600 cursor-not-allowed"
                } text-white`}
              >
                Start Playoffs
              </Button>
            )}
          </div>
        </div>
        
        {tournament.currentPhase === "playoffs" ? (
          tournament.playoffMatches.length > 0 ? (
            <PlayoffView 
              tournament={tournament}
              onTournamentUpdate={handleTournamentUpdate}
            />
          ) : (
            <EnterPlayoffView 
              tournament={tournament}
              onTournamentUpdate={handleTournamentUpdate}
            />
          )
        ) : (
          <RegularSeasonView 
            tournament={tournament}
            onTournamentUpdate={handleTournamentUpdate}
          />
        )}

        <Dialog open={showTeamView} onOpenChange={setShowTeamView}>
          <DialogContent className="bg-dashboard-background text-dashboard-text max-w-4xl max-h-[80vh] overflow-hidden">
            <TeamView 
              tournament={tournament} 
              onTeamNameUpdate={handleTeamNameUpdate} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default TournamentView;