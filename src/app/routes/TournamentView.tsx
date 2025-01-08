import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/dashboard/Layout";
import { Tournament } from "@/types/tournament";
import RegularSeasonView from "@/components/tournament/RegularSeasonView";
import PlayoffView from "@/components/tournament/PlayoffView";
import PlayoffOnlyView from "@/components/tournament/PlayoffOnlyView";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { tournamentApi } from "@/services/api";

const TournamentView = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTournament = async () => {
      if (!id) return;

      try {
        const response = await tournamentApi.getTournament(id);
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Tournament not found');
        }
        setTournament(response.data);
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

  const handleStartPlayoffs = async () => {
    if (!tournament || !areAllGamesPlayed()) return;
    
    const updatedTournament: Tournament = {
      ...tournament,
      currentPhase: "playoffs" as const
    };

    try {
      const response = await tournamentApi.updateTournament(tournament.id, updatedTournament);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to start playoffs');
      }
      setTournament(response.data);
      
      toast({
        title: "Playoffs Started! 🏆",
        description: "The regular season has ended and playoffs have begun.",
      });
    } catch (error) {
      console.error('Failed to start playoffs:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start playoffs. Please try again."
      });
    }
  };

  const handleTournamentUpdate = async (updatedTournament: Tournament) => {
    try {
      const response = await tournamentApi.updateTournament(updatedTournament.id, updatedTournament);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to update tournament');
      }
      setTournament(response.data);
    } catch (error) {
      console.error('Failed to update tournament:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update tournament. Please try again."
      });
    }
  };

  const areAllGamesPlayed = () => {
    if (!tournament) return false;
    return tournament.regularMatches.every(match => 
      match.team1Score !== undefined && 
      match.team2Score !== undefined && 
      (match.team1Score > 0 || match.team2Score > 0)
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-dashboard-text">Loading tournament...</div>
        </div>
      </Layout>
    );
  }

  if (!tournament) {
    return (
      <Layout>
        <div className="text-center py-8 text-dashboard-text">
          Tournament not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">{tournament.name}</h2>
            <p className="text-dashboard-text mt-2">
              {tournament.format === "singles" ? "Singles" : "Doubles"} Tournament
            </p>
          </div>
          {tournament.type === "regular+playoffs" && tournament.currentPhase === "regular" && (
            <Button
              onClick={handleStartPlayoffs}
              disabled={!areAllGamesPlayed()}
              className="bg-dashboard-accent hover:bg-dashboard-accent/90"
            >
              Start Playoffs
            </Button>
          )}
        </div>

        {tournament.type === "playoffs" ? (
          <PlayoffOnlyView tournament={tournament} onTournamentUpdate={handleTournamentUpdate} />
        ) : tournament.currentPhase === "playoffs" ? (
          <PlayoffView tournament={tournament} onTournamentUpdate={handleTournamentUpdate} />
        ) : (
          <RegularSeasonView tournament={tournament} onTournamentUpdate={handleTournamentUpdate} />
        )}
      </div>
    </Layout>
  );
};

export default TournamentView;