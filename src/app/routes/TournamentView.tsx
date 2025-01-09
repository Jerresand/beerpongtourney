import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/dashboard/Layout";
import { Tournament } from "@/types/tournament";
import RegularSeasonView from "@/components/tournament/RegularSeasonView";
import PlayoffView from "@/components/tournament/PlayoffView";
import PlayoffOnlyView from "@/components/tournament/PlayoffOnlyView";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const TournamentView = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTournament = () => {
      if (!id) return;

      try {
        const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
        const found = tournaments.find((t: Tournament) => t.id === id);
        if (!found) {
          throw new Error('Tournament not found');
        }
        setTournament(found);
      } catch (error) {
        console.error('Failed to fetch tournament:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load tournament. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournament();
  }, [id, toast]);

  const handleStartPlayoffs = () => {
    if (!tournament || !areAllGamesPlayed()) return;
    
    const updatedTournament: Tournament = {
      ...tournament,
      currentPhase: "playoffs" as const
    };

    handleTournamentUpdate(updatedTournament);
  };

  const handleTournamentUpdate = (updatedTournament: Tournament) => {
    try {
      const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
      const updatedTournaments = tournaments.map((t: Tournament) => 
        t.id === updatedTournament.id ? updatedTournament : t
      );
      localStorage.setItem('tournaments', JSON.stringify(updatedTournaments));
      setTournament(updatedTournament);
      
      toast({
        title: "Success",
        description: "Tournament updated successfully"
      });
    } catch (error) {
      console.error('Failed to update tournament:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update tournament. Please try again."
      });
    }
  };

  const areAllGamesPlayed = () => {
    if (!tournament) return false;
    return tournament.regularMatches.every(match => match.isComplete);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dashboard-accent"></div>
        </div>
      </Layout>
    );
  }

  if (!tournament) {
    return (
      <Layout>
        <div className="text-center text-dashboard-text">
          <h1 className="text-2xl font-bold">Tournament not found</h1>
          <p>The tournament you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-dashboard-text">{tournament.name}</h1>
          {tournament.type === "regular+playoffs" && tournament.currentPhase === "regular" && areAllGamesPlayed() && (
            <Button 
              onClick={handleStartPlayoffs}
              className="bg-dashboard-accent hover:bg-dashboard-accent/90"
            >
              Start Playoffs
            </Button>
          )}
        </div>

        {tournament.type === "playoffs" ? (
          <PlayoffOnlyView 
            tournament={tournament} 
            onTournamentUpdate={handleTournamentUpdate}
          />
        ) : tournament.currentPhase === "playoffs" ? (
          <PlayoffView 
            tournament={tournament} 
            onTournamentUpdate={handleTournamentUpdate}
          />
        ) : (
          <RegularSeasonView 
            tournament={tournament} 
            onTournamentUpdate={handleTournamentUpdate}
          />
        )}
      </div>
    </Layout>
  );
};

export default TournamentView;