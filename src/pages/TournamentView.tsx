import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/dashboard/Layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Trophy, Shield, Target } from "lucide-react";

interface Player {
  name: string;
  totalCups: number;
  iced: number;
  defense: number;
}

interface Match {
  id: string;
  team1Score: number;
  team2Score: number;
  team1Players: {
    player: Player;
    cups: number;
    defense: number;
    isIcer: boolean;
  }[];
  team2Players: {
    player: Player;
    cups: number;
    defense: number;
    isIcer: boolean;
  }[];
  date: string;
}

interface Tournament {
  id: string;
  name: string;
  players: Player[];
  matches: Match[];
  format: "singles" | "doubles";
  type: "playoffs" | "regular+playoffs";
}

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
  const [standings, setStandings] = useState<Standing[]>([]);

  useEffect(() => {
    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const tournament = tournaments.find((t: Tournament) => t.id === id);
    if (tournament) {
      setTournament(tournament);
      calculateStandings(tournament);
    }
  }, [id]);

  const calculateStandings = (tournament: Tournament) => {
    const playerStats = new Map<string, Standing>();

    // Initialize standings for all players
    tournament.players.forEach(player => {
      playerStats.set(player.name, {
        player,
        wins: 0,
        losses: 0,
        winPercentage: 0
      });
    });

    // Calculate wins and losses
    tournament.matches.forEach(match => {
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

  const getPlayerStats = () => {
    if (!tournament) return [];

    const playerStats = new Map<string, { 
      name: string;
      cups: number;
      iced: number;
      defense: number;
    }>();

    // Initialize stats for all players
    tournament.players.forEach(player => {
      playerStats.set(player.name, {
        name: player.name,
        cups: 0,
        iced: 0,
        defense: 0
      });
    });

    // Calculate stats from matches
    tournament.matches.forEach(match => {
      // Process team 1 players
      match.team1Players.forEach(({ player, cups, defense, isIcer }) => {
        const stats = playerStats.get(player.name);
        if (stats) {
          stats.cups += cups || 0;
          stats.defense += defense || 0;
          if (isIcer) stats.iced += 1;
        }
      });

      // Process team 2 players
      match.team2Players.forEach(({ player, cups, defense, isIcer }) => {
        const stats = playerStats.get(player.name);
        if (stats) {
          stats.cups += cups || 0;
          stats.defense += defense || 0;
          if (isIcer) stats.iced += 1;
        }
      });
    });

    return Array.from(playerStats.values());
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
          <Button
            variant="outline"
            onClick={() => setShowStatistics(!showStatistics)}
          >
            {showStatistics ? "Show Matches" : "Show Statistics"}
          </Button>
        </div>

        {/* Standings Table */}
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
              {standings.map((standing) => (
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

        {showStatistics ? (
          <div className="bg-dashboard-card p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Player Statistics</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Cups
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Iced
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Defense
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getPlayerStats().map((stat) => (
                  <TableRow key={stat.name}>
                    <TableCell className="text-white">{stat.name}</TableCell>
                    <TableCell className="text-dashboard-text">{stat.cups}</TableCell>
                    <TableCell className="text-dashboard-text">{stat.iced}</TableCell>
                    <TableCell className="text-dashboard-text">{stat.defense}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-dashboard-card p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Match Schedule</h3>
            <div className="space-y-4">
              {tournament.matches.map((match) => (
                <div key={match.id} className="border border-dashboard-border p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Team 1 */}
                    <div className="space-y-2">
                      {match.team1Players.map((player, index) => (
                        <div key={player.player.name} className="space-y-1">
                          <p className="text-white">{player.player.name}</p>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Cups"
                            value={player.cups || ""}
                            onChange={(e) => {
                              const newStats = match.team1Players.map((p, i) =>
                                i === index
                                  ? {
                                      playerId: p.player.name,
                                      cups: parseInt(e.target.value) || 0,
                                      defense: p.defense,
                                      isIcer: p.isIcer,
                                    }
                                  : {
                                      playerId: p.player.name,
                                      cups: p.cups,
                                      defense: p.defense,
                                      isIcer: p.isIcer,
                                    }
                              );
                              updateMatchScore(match.id, 1, match.team1Score, newStats);
                            }}
                          />
                          <Input
                            type="number"
                            min="0"
                            placeholder="Defense"
                            value={player.defense || ""}
                            onChange={(e) => {
                              const newStats = match.team1Players.map((p, i) =>
                                i === index
                                  ? {
                                      playerId: p.player.name,
                                      cups: p.cups,
                                      defense: parseInt(e.target.value) || 0,
                                      isIcer: p.isIcer,
                                    }
                                  : {
                                      playerId: p.player.name,
                                      cups: p.cups,
                                      defense: p.defense,
                                      isIcer: p.isIcer,
                                    }
                              );
                              updateMatchScore(match.id, 1, match.team1Score, newStats);
                            }}
                          />
                          <Button
                            variant={player.isIcer ? "default" : "outline"}
                            onClick={() => {
                              const newStats = match.team1Players.map((p, i) =>
                                i === index
                                  ? {
                                      playerId: p.player.name,
                                      cups: p.cups,
                                      defense: p.defense,
                                      isIcer: !p.isIcer,
                                    }
                                  : {
                                      playerId: p.player.name,
                                      cups: p.cups,
                                      defense: p.defense,
                                      isIcer: false,
                                    }
                              );
                              updateMatchScore(match.id, 1, match.team1Score, newStats);
                            }}
                          >
                            Iced
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Score */}
                    <div className="flex items-center justify-center text-2xl text-white">
                      <span>{match.team1Score || 0}</span>
                      <span className="mx-2">-</span>
                      <span>{match.team2Score || 0}</span>
                    </div>

                    {/* Team 2 */}
                    <div className="space-y-2">
                      {match.team2Players.map((player, index) => (
                        <div key={player.player.name} className="space-y-1">
                          <p className="text-white">{player.player.name}</p>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Cups"
                            value={player.cups || ""}
                            onChange={(e) => {
                              const newStats = match.team2Players.map((p, i) =>
                                i === index
                                  ? {
                                      playerId: p.player.name,
                                      cups: parseInt(e.target.value) || 0,
                                      defense: p.defense,
                                      isIcer: p.isIcer,
                                    }
                                  : {
                                      playerId: p.player.name,
                                      cups: p.cups,
                                      defense: p.defense,
                                      isIcer: p.isIcer,
                                    }
                              );
                              updateMatchScore(match.id, 2, match.team2Score, newStats);
                            }}
                          />
                          <Input
                            type="number"
                            min="0"
                            placeholder="Defense"
                            value={player.defense || ""}
                            onChange={(e) => {
                              const newStats = match.team2Players.map((p, i) =>
                                i === index
                                  ? {
                                      playerId: p.player.name,
                                      cups: p.cups,
                                      defense: parseInt(e.target.value) || 0,
                                      isIcer: p.isIcer,
                                    }
                                  : {
                                      playerId: p.player.name,
                                      cups: p.cups,
                                      defense: p.defense,
                                      isIcer: p.isIcer,
                                    }
                              );
                              updateMatchScore(match.id, 2, match.team2Score, newStats);
                            }}
                          />
                          <Button
                            variant={player.isIcer ? "default" : "outline"}
                            onClick={() => {
                              const newStats = match.team2Players.map((p, i) =>
                                i === index
                                  ? {
                                      playerId: p.player.name,
                                      cups: p.cups,
                                      defense: p.defense,
                                      isIcer: !p.isIcer,
                                    }
                                  : {
                                      playerId: p.player.name,
                                      cups: p.cups,
                                      defense: p.defense,
                                      isIcer: false,
                                    }
                              );
                              updateMatchScore(match.id, 2, match.team2Score, newStats);
                            }}
                          >
                            Iced
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TournamentView;
