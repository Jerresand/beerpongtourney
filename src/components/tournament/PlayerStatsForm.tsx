import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Player } from '@/types/tournament';

interface PlayerStats {
  cups: number;
  ices: number;
  defense: number;
}

interface PlayerStatsFormProps {
  player: Player;
  stats: PlayerStats;
  onStatsChange: (field: keyof PlayerStats, value: number) => void;
}

const PlayerStatsForm = ({ player, stats, onStatsChange }: PlayerStatsFormProps) => {
  return (
    <div className="mb-4 p-4 bg-dashboard-background rounded-lg">
      <h4 className="font-medium mb-2">{player.name}</h4>
      <div className="space-y-2">
        <div>
          <Label>Cups</Label>
          <Input
            type="number"
            value={stats.cups}
            onChange={(e) => onStatsChange('cups', parseInt(e.target.value) || 0)}
            className="bg-dashboard-card"
          />
        </div>
        <div>
          <Label>Ices</Label>
          <Input
            type="number"
            value={stats.ices}
            onChange={(e) => onStatsChange('ices', parseInt(e.target.value) || 0)}
            className="bg-dashboard-card"
          />
        </div>
        <div>
          <Label>Defenses</Label>
          <Input
            type="number"
            value={stats.defense}
            onChange={(e) => onStatsChange('defense', parseInt(e.target.value) || 0)}
            className="bg-dashboard-card"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsForm;