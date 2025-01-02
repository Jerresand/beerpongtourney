import React from 'react';

interface PlayerStats {
  cups: number;
  ices: number;
  defense: number;
}

interface TeamStatsFormProps {
  teamName: string;
  score: number;
  onScoreChange: (value: number) => void;
  players: { player: Player }[];
  playerStats: PlayerStats[];
  onPlayerStatsChange: (playerIndex: number, field: keyof PlayerStats, value: number) => void;
}

const TeamStatsForm = ({ 
  teamName, 
  score, 
  onScoreChange, 
  players, 
  playerStats, 
  onPlayerStatsChange 
}: TeamStatsFormProps) => {
  return (
    <div className="bg-dashboard-background p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">{teamName}</h3>
      <div className="mb-3">
        <label className="block text-sm mb-1">Score</label>
        <input
          type="number"
          value={score}
          onChange={(e) => onScoreChange(Math.max(0, parseInt(e.target.value) || 0))}
          className="w-full px-3 py-2 bg-dashboard-card text-white rounded border border-gray-600"
        />
      </div>
      <div className="space-y-3">
        {players.map((player, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="font-medium">{player.player.name}</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm mb-1">Cups</label>
                <input
                  type="number"
                  value={playerStats[idx].cups}
                  onChange={(e) => onPlayerStatsChange(idx, 'cups', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-dashboard-card text-white rounded border border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Ices</label>
                <input
                  type="number"
                  value={playerStats[idx].ices}
                  onChange={(e) => onPlayerStatsChange(idx, 'ices', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-dashboard-card text-white rounded border border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Defense</label>
                <input
                  type="number"
                  value={playerStats[idx].defense}
                  onChange={(e) => onPlayerStatsChange(idx, 'defense', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-dashboard-card text-white rounded border border-gray-600"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamStatsForm;