import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { MatchPlayerStats } from '@/types/tournament';
import { useToast } from "@/components/ui/use-toast";

interface PlayerStatsInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  statKey: keyof Omit<MatchPlayerStats, 'playerId'>;
}

const PlayerStatsInput = ({ label, value, onChange, statKey }: PlayerStatsInputProps) => {
  const { toast } = useToast();
  
  const validateAndUpdate = (newValue: number) => {
    if (newValue < 0) {
      toast({
        title: "Invalid Value",
        description: `${label} cannot be negative`,
        variant: "destructive"
      });
      return;
    }
    if (newValue > 99) {
      toast({
        title: "Invalid Value",
        description: `${label} cannot exceed 99`,
        variant: "destructive"
      });
      return;
    }
    onChange(newValue);
  };

  const increment = () => validateAndUpdate(value + 1);
  const decrement = () => validateAndUpdate(Math.max(value - 1, 0));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    validateAndUpdate(newValue);
  };

  return (
    <div className="flex items-center gap-2 bg-dashboard-card p-2 rounded-lg">
      <Label className="w-16 text-sm font-medium text-dashboard-text">{label}</Label>
      <div className="flex items-center gap-1">
        <Button 
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-dashboard-background text-dashboard-text hover:bg-dashboard-muted"
          onClick={decrement}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          className="w-14 text-center mx-1 h-8 bg-dashboard-background text-dashboard-text border-dashboard-muted"
          min="0"
          max="99"
        />
        <Button 
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-dashboard-background text-dashboard-text hover:bg-dashboard-muted"
          onClick={increment}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlayerStatsInput;