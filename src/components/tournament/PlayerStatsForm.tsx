import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PlayerStats {
  cups: number;
  ices: number;
  defense: number;
}

interface PlayerStatsFormProps {
  playerName: string;
  stats: PlayerStats;
  onChange: (field: keyof PlayerStats, value: number) => void;
}

const PlayerStatsForm = ({ playerName, stats, onChange }: PlayerStatsFormProps) => {
  return (
    <div className="mb-4 p-4 bg-dashboard-background rounded-lg">
      <h4 className="font-medium mb-2">{playerName}</h4>
      <div className="space-y-2">
        <div>
          <Label>Cups</Label>
          <Input
            type="number"
            value={stats.cups}
            onChange={(e) => onChange('cups', parseInt(e.target.value) || 0)}
            className="bg-dashboard-card"
          />
        </div>
        <div>
          <Label>Ices</Label>
          <Input
            type="number"
            value={stats.ices}
            onChange={(e) => onChange('ices', parseInt(e.target.value) || 0)}
            className="bg-dashboard-card"
          />
        </div>
        <div>
          <Label>Defenses</Label>
          <Input
            type="number"
            value={stats.defense}
            onChange={(e) => onChange('defense', parseInt(e.target.value) || 0)}
            className="bg-dashboard-card"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsForm;