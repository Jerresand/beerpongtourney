import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/dashboard/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trophy, Shield, Target, Users } from "lucide-react";
import { Tournament, Player } from "@/types/tournament";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MatchSchedule from "@/components/tournament/MatchSchedule";
import TeamView from "@/components/tournament/TeamView";

interface Standing {
  player: Player;
  wins: number;
  losses: number;
  winPercentage: number;
}

const TournamentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const [standings, setStandings] = useState<Standing[]>([]);

  useEffect(() => {
    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const tournament = tournaments.find((t: Tournament) => t.id === id);
    if (tournament) {
      setTournament(tournament);
      calculateStandings(tournament);
    }
  }, [id]);

  const calculateStandings = (tournament: Tournament | null) => {
    if (!tournament?.players || !tournament?.matches) {
      setStandings([]);
      return;
    }
    
    const playerStats = new Map<string, Standing>();

    // Initialize standings for all players
    tournament.players.forEach(player => {
      playerStats.set(player.name, {
        player: {
          name: player.name,
          totalCups: player.totalCups || 0,
          iced: player.iced || 0,
          defense: player.defense || 0
        },
        wins: 0,
        losses: 0,
        winPercentage: 0
      });
    });

    // Calculate wins and losses
    tournament.matches.forEach(match => {
      if (!match.team1Players || !match.team2Players) return;
      if (match.team1Score === undefined || match.team2Score === undefined) return;

      const team1Won = match.team1Score > match.team2Score;
      
      match.team1Players.forEach(({ player }) => {
        const stats = playerStats.get(player.name);
        if (stats) {
          if (team1Won) stats.wins += 1;
          else stats.losses += 1;
          stats.winPercentage = stats.wins / (stats.wins + stats.losses);
        }
      });

      match.team2Players.forEach(({ player }) => {
        const stats = playerStats.get(player.name);
        if (stats) {
          if (!team1Won) stats.wins += 1;
          else stats.losses += 1;
          stats.winPercentage = stats.wins / (stats.wins + stats.losses);
        }
      });
    });

    setStandings(Array.from(playerStats.values()).sort((a, b) => b.winPercentage - a.winPercentage));
  };

  const updateMatchScore = (matchId: string, team: 1 | 2, score: number, playerStats: { playerId: string, cups: number, defense: number, isIcer: boolean }[]) => {
    if (!tournament) return;

    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const updatedTournament = { ...tournament };
    const matchIndex = updatedTournament.matches.findIndex(m => m.id === matchId);

    if (matchIndex === -1) return;

    // Validate that cups add up to score
    const totalCups = playerStats.reduce((sum, stat) => sum + stat.cups, 0);
    if (totalCups !== score) {
      toast({
        variant: "destructive",
        title: "Invalid cups count",
        description: `Total cups (${totalCups}) doesn't match the score (${score})`,
      });
      return;
    }

    const match = updatedTournament.matches[matchIndex];
    if (team === 1) {
      match.team1Score = score;
      match.team1Players = match.team1Players.map((player, index) => ({
        ...player,
        cups: playerStats[index].cups,
        defense: playerStats[index].defense,
        isIcer: playerStats[index].isIcer,
      }));
    } else {
      match.team2Score = score;
      match.team2Players = match.team2Players.map((player, index) => ({
        ...player,
        cups: playerStats[index].cups,
        defense: playerStats[index].defense,
        isIcer: playerStats[index].isIcer,
      }));
    }

    const updatedTournaments = tournaments.map((t: Tournament) =>
      t.id === id ? updatedTournament : t
    );

    localStorage.setItem("activeTournaments", JSON.stringify(updatedTournaments));
    setTournament(updatedTournament);
    calculateStandings(updatedTournament);
  };

  const handleTeamNameUpdate = (teamId: string, newName: string) => {
    // Store team names in localStorage
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
          <div className="bg-dashboard-card p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Standings</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>W</TableHead>
                  <TableHead>L</TableHead>
                  <TableHead>Win %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standings?.map((standing) => (
                  <TableRow key={standing.player.name}>
                    <TableCell className="text-white">{standing.player.name}</TableCell>
                    <TableCell className="text-dashboard-text">{standing.wins}</TableCell>
                    <TableCell className="text-dashboard-text">{standing.losses}</TableCell>
                    <TableCell className="text-dashboard-text">
                      {(standing.winPercentage * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <MatchSchedule matches={tournament.matches} />
        )}
      </div>
    </Layout>
  );
};

export default TournamentView;
