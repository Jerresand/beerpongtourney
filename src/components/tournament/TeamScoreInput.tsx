import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface TeamScoreInputProps {
  teamName: string;
  score: number;
  onScoreChange: (score: number) => void;
}

const TeamScoreInput = ({ teamName, score, onScoreChange }: TeamScoreInputProps) => {
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
  );
};

export default TeamScoreInput;