import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PlayerStatsInput from './PlayerStatsInput';
import { Team, MatchPlayerStats } from '@/types/tournament';
import { useToast } from "@/components/ui/use-toast";

interface TeamStatsSectionProps {
  team: Team;
  score: number;
  playerStats: MatchPlayerStats[];
  onScoreChange: (score: number) => void;
  onPlayerStatChange: (
    playerIndex: number,
    field: keyof Omit<MatchPlayerStats, 'playerId'>,
    value: number
  ) => void;
}

const TeamStatsSection = ({
  team,
  score,
  playerStats,
  onScoreChange,
  onPlayerStatChange,
}: TeamStatsSectionProps) => {
  const { toast } = useToast();

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = parseInt(e.target.value) || 0;
    if (newScore < 0) {
      toast({
        title: "Invalid Score",
        description: "Score cannot be negative",
        variant: "destructive"
      });
      return;
    }
    onScoreChange(newScore);
  };

  return (
    <div className="space-y-4 bg-dashboard-background p-4 rounded-lg">
      <div className="flex items-center justify-between bg-dashboard-card p-3 rounded-lg">
        <h3 className="text-lg font-semibold text-dashboard-text">{team.name}</h3>
        <div className="flex items-center gap-2">
          <Label className="text-dashboard-text">Score</Label>
          <Input
            type="number"
            value={score}
            onChange={handleScoreChange}
            className="w-20 bg-dashboard-background text-dashboard-text border-dashboard-muted"
            min="0"
          />
        </div>
      </div>

      <div className="space-y-3">
        {team.players.map((player, index) => (
          <div key={player.id} className="p-3 bg-dashboard-card rounded-lg">
            <h4 className="font-medium text-sm mb-3 text-dashboard-text">{player.name}</h4>
            <div className="space-y-2">
              <PlayerStatsInput
                label="Cups"
                value={playerStats[index].cups}
                onChange={(value) => onPlayerStatChange(index, 'cups', value)}
                statKey="cups"
              />
              <PlayerStatsInput
                label="Ices"
                value={playerStats[index].ices}
                onChange={(value) => onPlayerStatChange(index, 'ices', value)}
                statKey="ices"
              />
              <PlayerStatsInput
                label="Defense"
                value={playerStats[index].defense}
                onChange={(value) => onPlayerStatChange(index, 'defense', value)}
                statKey="defense"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamStatsSection;