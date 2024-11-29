import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Trophy, Users } from "lucide-react";

interface Player {
  name: string;
}

interface Tournament {
  name: string;
  players: Player[];
  format: "singles" | "doubles";
  matchesPerTeam: number;
  type: "playoffs" | "regular+playoffs";
}

const TournamentCreator = () => {
  const [tournamentName, setTournamentName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [format, setFormat] = useState<"singles" | "doubles">("singles");
  const [matchesPerTeam, setMatchesPerTeam] = useState("3");
  const [tournamentType, setTournamentType] = useState<"playoffs" | "regular+playoffs">("regular+playoffs");
  const { toast } = useToast();

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, { name: newPlayerName.trim() }]);
      setNewPlayerName("");
    }
  };

  const handleRemovePlayer = (index: number) => {
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
  };

  const handleCreateTournament = () => {
    if (players.length < 4) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You need at least 4 players to create a tournament",
      });
      return;
    }

    if (format === "doubles" && players.length % 2 !== 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You need an even number of players for doubles",
      });
      return;
    }

    const tournament: Tournament = {
      name: tournamentName,
      players,
      format,
      matchesPerTeam: parseInt(matchesPerTeam),
      type: tournamentType,
    };

    // Here you would typically save to a backend
    toast({
      title: "Tournament Created! 🎉",
      description: `${tournamentName} has been created with ${players.length} players`,
    });

    // Reset form
    setTournamentName("");
    setPlayers([]);
    setFormat("singles");
    setMatchesPerTeam("3");
    setTournamentType("regular+playoffs");
  };

  return (
    <div className="space-y-6 bg-dashboard-card p-6 rounded-lg">
      <div className="space-y-4">
        <Input
          placeholder="Tournament Name"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
          className="bg-dashboard-background text-white"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={format} onValueChange={(value: "singles" | "doubles") => setFormat(value)}>
            <SelectTrigger className="bg-dashboard-background text-white">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="singles">Singles</SelectItem>
              <SelectItem value="doubles">Doubles</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tournamentType} onValueChange={(value: "playoffs" | "regular+playoffs") => setTournamentType(value)}>
            <SelectTrigger className="bg-dashboard-background text-white">
              <SelectValue placeholder="Tournament Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="playoffs">Playoffs Only</SelectItem>
              <SelectItem value="regular+playoffs">Regular Season + Playoffs</SelectItem>
            </SelectContent>
          </Select>

          <Select value={matchesPerTeam} onValueChange={setMatchesPerTeam}>
            <SelectTrigger className="bg-dashboard-background text-white">
              <SelectValue placeholder="Matches per Team" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Match" : "Matches"} per Team
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Player Name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
              className="bg-dashboard-background text-white"
            />
            <Button onClick={handleAddPlayer} variant="outline">
              Add Player
            </Button>
          </div>

          <div className="space-y-2 mt-4">
            {players.map((player, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-dashboard-background p-2 rounded"
              >
                <span className="text-white">{player.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePlayer(index)}
                  className="text-dashboard-text hover:text-white"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={handleCreateTournament}
        className="w-full bg-dashboard-accent hover:bg-dashboard-accent/90"
      >
        Create Tournament
      </Button>
    </div>
  );
};

export default TournamentCreator;