import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/dashboard/Layout";
import { Tournament } from "@/types/tournament";
import RegularSeasonView from "@/components/tournament/RegularSeasonView";
import PlayoffView from "@/components/tournament/PlayoffView";
import StatisticsTable from "@/components/tournament/StatisticsTable";
import TeamView from "@/components/tournament/TeamView";
import StandingsTable from "@/components/tournament/StandingsTable";
import { Standing } from "@/utils/tournamentUtils";

const TournamentView = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);

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

  // Calculate standings
  const standings: Standing[] = tournament?.teams.map(team => ({
    name: team.name,
    wins: team.stats?.wins || 0,
    losses: team.stats?.losses || 0,
    winPercentage: team.stats?.gamesPlayed 
      ? (team.stats.wins / team.stats.gamesPlayed) * 100 
      : 0,
    matchesPlayed: team.stats?.gamesPlayed || 0,
    points: team.stats?.wins || 0,
    pointsAgainst: team.stats?.losses || 0
  })).sort((a, b) => b.winPercentage - a.winPercentage) || [];

  if (!tournament) return <div>Tournament not found</div>;

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white">{tournament.name}</h2>
          <p className="text-dashboard-text mt-2">
            {tournament.format} - {tournament.type}
          </p>
        </div>
        
        <StatisticsTable players={tournament.players} />
        <TeamView tournament={tournament} onTeamNameUpdate={handleTeamNameUpdate} />
        <StandingsTable standings={standings} />
        
        {tournament.currentPhase === "playoffs" ? (
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