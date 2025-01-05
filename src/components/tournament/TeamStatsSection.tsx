import React from 'react';
import { Team, MatchPlayerStats } from '@/types/tournament';
import PlayerStatsInput from './PlayerStatsInput';
import TeamScoreInput from './TeamScoreInput';
import { useTeamScoreSync } from '@/hooks/useTeamScoreSync';

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
  const { score: syncedScore, setScore } = useTeamScoreSync(score, playerStats, onScoreChange);

  return (
    <div className="space-y-4 bg-dashboard-background p-4 rounded-lg">
      <div className="flex items-center justify-between bg-dashboard-card p-3 rounded-lg">
        <h3 className="text-lg font-semibold text-dashboard-text">{team.name}</h3>
        <TeamScoreInput
          teamName={team.name}
          score={syncedScore}
          onScoreChange={setScore}
        />
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