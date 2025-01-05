import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { MatchPlayerStats } from '@/types/tournament';

interface PlayerStatsInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  statKey: keyof Omit<MatchPlayerStats, 'playerId'>;
}

const PlayerStatsInput = ({ label, value, onChange, statKey }: PlayerStatsInputProps) => {
  const increment = () => onChange(Math.min(value + 1, 99));
  const decrement = () => onChange(Math.max(value - 1, 0));

  return (
    <div className="flex items-center gap-2">
      <Label className="w-16 text-sm">{label}</Label>
      <div className="flex items-center">
        <Button 
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={decrement}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="w-14 text-center mx-1 h-8"
          min="0"
          max="99"
        />
        <Button 
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={increment}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlayerStatsInput;