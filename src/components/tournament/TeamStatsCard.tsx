import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PlayerStats {
  name: string;
  stats: {
    cups: number;
    ices: number;
    defense: number;
  };
  onStatsChange: (field: string, value: number) => void;
}

interface TeamStatsCardProps {
  teamName: string;
  score: number;
  onScoreChange: (score: number) => void;
  players: PlayerStats[];
}

const TeamStatsCard = ({ teamName, score, onScoreChange, players }: TeamStatsCardProps) => {
  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{teamName}</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onScoreChange(Math.max(0, score - 1))}
          >
            -
          </Button>
          <span className="w-8 text-center">{score}</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onScoreChange(score + 1)}
          >
            +
          </Button>
        </div>
      </div>

      {players.map((player, index) => (
        <div key={player.name} className="space-y-2">
          <h4 className="font-medium text-gray-300">{player.name}</h4>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-sm text-gray-400">Cups</label>
              <Input
                type="number"
                value={player.stats.cups}
                onChange={(e) => player.onStatsChange('cups', parseInt(e.target.value) || 0)}
                className="bg-gray-700"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Ices</label>
              <Input
                type="number"
                value={player.stats.ices}
                onChange={(e) => player.onStatsChange('ices', parseInt(e.target.value) || 0)}
                className="bg-gray-700"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Defense</label>
              <Input
                type="number"
                value={player.stats.defense}
                onChange={(e) => player.onStatsChange('defense', parseInt(e.target.value) || 0)}
                className="bg-gray-700"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamStatsCard; 