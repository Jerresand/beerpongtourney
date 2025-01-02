import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Player, Team } from "@/types/tournament";

interface DoublesTeamCreatorProps {
  players: Player[];
  onTeamsCreated: (teams: Team[]) => void;
}

const DoublesTeamCreator = ({ players, onTeamsCreated }: DoublesTeamCreatorProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>(players);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const handlePlayerSelect = (player: Player) => {
    if (selectedPlayers.length < 2) {
      setSelectedPlayers([...selectedPlayers, player]);
      setAvailablePlayers(availablePlayers.filter(p => p.name !== player.name));
    }
  };

  const handleCreateTeam = () => {
    if (selectedPlayers.length === 2) {
      const newTeam: Team = {
        name: `${selectedPlayers[0].name} & ${selectedPlayers[1].name}`,
        players: selectedPlayers
      };
      setTeams([...teams, newTeam]);
      setSelectedPlayers([]);
    }
  };

  const handleFinish = () => {
    if (availablePlayers.length === 0) {
      onTeamsCreated(teams);
    }
  };

  const handleRandomTeams = () => {
    // Keep track of all existing teams
    const existingTeams = [...teams];
    
    // Create a shuffled copy of available players only
    const shuffledPlayers = [...availablePlayers]
      .sort(() => Math.random() - 0.5);
    
    // Create teams from shuffled players
    const newTeams: Team[] = [];
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      newTeams.push({
        name: `${shuffledPlayers[i].name} & ${shuffledPlayers[i + 1].name}`,
        players: [shuffledPlayers[i], shuffledPlayers[i + 1]]
      });
    }
    
    // Update state with all teams
    setTeams([...existingTeams, ...newTeams]);
    setAvailablePlayers([]);
    setSelectedPlayers([]);
  };

  return (
    <div className="space-y-6 bg-dashboard-card p-6 rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Create Doubles Teams</h2>
        <Button
          onClick={handleRandomTeams}
          variant="outline"
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={availablePlayers.length === 0}
        >
          Randomize Teams 🎲
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Available Players</h3>
          <div className="space-y-2">
            {availablePlayers.map(player => (
              <Button
                key={player.name}
                variant="secondary"
                onClick={() => handlePlayerSelect(player)}
                className="w-full bg-gray-700 hover:bg-purple-700 text-white"
              >
                {player.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Selected Players</h3>
          <div className="space-y-2">
            {selectedPlayers.map(player => (
              <div key={player.name} className="text-white p-2 bg-purple-800 rounded">
                {player.name}
              </div>
            ))}
          </div>

          {selectedPlayers.length === 2 && (
            <Button
              onClick={handleCreateTeam}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
            >
              Create Team
            </Button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Created Teams</h3>
        <div className="space-y-2">
          {teams.map(team => (
            <div key={team.name} className="text-white p-2 bg-blue-800 rounded">
              {team.name}
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={handleFinish}
        disabled={availablePlayers.length > 0}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        Finish Team Creation
      </Button>
    </div>
  );
};

export default DoublesTeamCreator; 