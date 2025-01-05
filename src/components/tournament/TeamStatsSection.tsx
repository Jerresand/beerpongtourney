import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PlayerStatsInput from './PlayerStatsInput';
import { Team, MatchPlayerStats } from '@/types/tournament';

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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{team.name}</h3>
        <div className="flex items-center gap-2">
          <Label>Score</Label>
          <Input
            type="number"
            value={score}
            onChange={(e) => onScoreChange(parseInt(e.target.value) || 0)}
            className="w-16 bg-dashboard-card"
            min="0"
          />
        </div>
      </div>

      {team.players.map((player, index) => (
        <div key={player.id} className="space-y-2 p-3 bg-dashboard-background rounded-lg">
          <h4 className="font-medium text-sm mb-2">{player.name}</h4>
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
  );
};

export default TeamStatsSection;