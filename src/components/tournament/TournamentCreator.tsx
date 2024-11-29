import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";
import TournamentHeader from "./TournamentHeader";
import TournamentSettings from "./TournamentSettings";
import PlayerManagement from "./PlayerManagement";

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
  const [groups, setGroups] = useState<{ name: string; players: Player[] }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    // Load groups from localStorage
    const loadGroups = () => {
      const groups = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            groups.push({ name: key, players: JSON.parse(value) });
          }
        }
      }
      setGroups(groups);
    };
    loadGroups();

    // Check if players were passed from group creation
    if (location.state?.players) {
      setPlayers(location.state.players);
    }
  }, [location.state]);

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

  const handleGroupSelect = (groupName: string) => {
    const group = groups.find(g => g.name === groupName);
    if (group) {
      setPlayers(group.players);
      setSelectedGroup(groupName);
    }
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
    setSelectedGroup("");
  };

  return (
    <div className="space-y-6 bg-dashboard-card p-6 rounded-lg">
      <div className="space-y-4">
        <TournamentHeader 
          tournamentName={tournamentName}
          setTournamentName={setTournamentName}
        />

        <TournamentSettings
          format={format}
          setFormat={setFormat}
          tournamentType={tournamentType}
          setTournamentType={setTournamentType}
          matchesPerTeam={matchesPerTeam}
          setMatchesPerTeam={setMatchesPerTeam}
        />

        <PlayerManagement
          newPlayerName={newPlayerName}
          setNewPlayerName={setNewPlayerName}
          handleAddPlayer={handleAddPlayer}
          players={players}
          handleRemovePlayer={handleRemovePlayer}
          groups={groups}
          selectedGroup={selectedGroup}
          handleGroupSelect={handleGroupSelect}
        />
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