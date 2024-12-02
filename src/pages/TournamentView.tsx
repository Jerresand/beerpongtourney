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

const TournamentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [showStatistics, setShowStatistics] = useState(false);

  useEffect(() => {
    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const tournament = tournaments.find((t: Tournament) => t.id === id);
    if (tournament) {
      // Initialize statistics if they don't exist
      if (!tournament.matches) tournament.matches = [];
      setTournament(tournament);
    }
  }, [id]);

  const updateTournament = (updatedTournament: Tournament) => {
    const tournaments = JSON.parse(localStorage.getItem("activeTournaments") || "[]");
    const updatedTournaments = tournaments.map((t: Tournament) =>
      t.id === id ? updatedTournament : t
    );
    localStorage.setItem("activeTournaments", JSON.stringify(updatedTournaments));
    setTournament(updatedTournament);
  };

  const validateMatch = (match: Match) => {
    const team1TotalCups = match.team1Players.reduce((sum, p) => sum + p.cups, 0);
    const team2TotalCups = match.team2Players.reduce((sum, p) => sum + p.cups, 0);
    
    if (team1TotalCups !== match.team1Score) {
      toast({
        title: "Invalid cups count",
        description: `Team 1's total cups (${team1TotalCups}) doesn't match the score (${match.team1Score})`,
        variant: "destructive",
      });
      return false;
    }
    
    if (team2TotalCups !== match.team2Score) {
      toast({
        title: "Invalid cups count",
        description: `Team 2's total cups (${team2TotalCups}) doesn't match the score (${match.team2Score})`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  if (!tournament) return <div>Tournament not found</div>;

  const getPlayerStats = () => {
    const stats = tournament.players.map(player => ({
      name: player.name,
      cups: tournament.matches.reduce((sum, match) => {
        const playerInTeam1 = match.team1Players.find(p => p.player.name === player.name);
        const playerInTeam2 = match.team2Players.find(p => p.player.name === player.name);
        return sum + (playerInTeam1?.cups || 0) + (playerInTeam2?.cups || 0);
      }, 0),
      iced: tournament.matches.reduce((sum, match) => {
        const playerInTeam1 = match.team1Players.find(p => p.player.name === player.name);
        const playerInTeam2 = match.team2Players.find(p => p.player.name === player.name);
        return sum + (playerInTeam1?.isIcer ? 1 : 0) + (playerInTeam2?.isIcer ? 1 : 0);
      }, 0),
      defense: tournament.matches.reduce((sum, match) => {
        const playerInTeam1 = match.team1Players.find(p => p.player.name === player.name);
        const playerInTeam2 = match.team2Players.find(p => p.player.name === player.name);
        return sum + (playerInTeam1?.defense || 0) + (playerInTeam2?.defense || 0);
      }, 0),
    }));

    return stats.sort((a, b) => b.cups - a.cups);
  };

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
            <h3 className="text-xl font-bold text-white mb-4">Matches</h3>
            {/* Match list and input form will be implemented in the next iteration */}
            <p className="text-dashboard-text">Match management coming soon...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TournamentView;