import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Player {
  name: string;
}

interface PlayerManagementProps {
  newPlayerName: string;
  setNewPlayerName: (name: string) => void;
  handleAddPlayer: () => void;
  players: Player[];
  handleRemovePlayer: (index: number) => void;
  groups: { name: string; players: Player[] }[];
  selectedGroup: string;
  handleGroupSelect: (groupName: string) => void;
}

const PlayerManagement = ({
  newPlayerName,
  setNewPlayerName,
  handleAddPlayer,
  players,
  handleRemovePlayer,
  groups,
  selectedGroup,
  handleGroupSelect,
}: PlayerManagementProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-2 flex-1">
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
        
        <div className="flex gap-2 flex-1">
          <Select value={selectedGroup} onValueChange={handleGroupSelect}>
            <SelectTrigger className="bg-dashboard-background text-white flex-1">
              <SelectValue placeholder="Select a Group" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.name} value={group.name}>
                  {group.name} ({group.players.length} players)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
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
  );
};

export default PlayerManagement;