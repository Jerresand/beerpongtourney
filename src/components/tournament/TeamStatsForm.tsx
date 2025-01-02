import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PlayerStatsForm from './PlayerStatsForm';
import { Match, Player } from '@/types/tournament';

interface TeamStats {
  cups: number;
  ices: number;
  defense: number;
}

interface TeamStatsFormProps {
  teamName: string;
  score: number;
  onScoreChange: (value: number) => void;
  players: { player: Player }[];
  playerStats: TeamStats[];
  onPlayerStatsChange: (playerIndex: number, field: keyof TeamStats, value: number) => void;
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
    <div>
      <h3 className="text-xl font-semibold mb-4">{teamName}</h3>
      <div className="mb-4">
        <Label>Score</Label>
        <Input
          type="number"
          value={score}
          onChange={(e) => onScoreChange(Math.max(0, parseInt(e.target.value) || 0))}
          className="bg-dashboard-background text-white"
        />
      </div>
      {players.map((player, idx) => (
        <PlayerStatsForm
          key={idx}
          playerName={player.player.name}
          stats={playerStats[idx]}
          onChange={(field, value) => onPlayerStatsChange(idx, field, value)}
        />
      ))}
    </div>
  );
};

export default TeamStatsForm;