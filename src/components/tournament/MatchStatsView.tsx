import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Match, Player } from '@/types/tournament';
import { useToast } from "@/components/ui/use-toast";
import PlayerStatsForm from './PlayerStatsForm';

interface MatchStatsProps {
  match: Match;
  isOpen: boolean;
  onClose: () => void;
  onSave: (match: Match) => void;
}

interface MatchStats {
  cups: number;
  ices: number;
  defense: number;
}

const MatchStatsView = ({ match, isOpen, onClose, onSave }: MatchStatsProps) => {
  const { toast } = useToast();
  const [team1Stats, setTeam1Stats] = useState<MatchStats[]>(
    match.team1Players.map(p => ({
      cups: p.cups || 0,
      ices: p.ices || 0,
      defense: p.defense || 0
    }))
  );
  const [team2Stats, setTeam2Stats] = useState<MatchStats[]>(
    match.team2Players.map(p => ({
      cups: p.cups || 0,
      ices: p.ices || 0,
      defense: p.defense || 0
    }))
  );

  // Calculate team scores from player cups
  const team1Score = team1Stats.reduce((sum, stats) => sum + stats.cups, 0);
  const team2Score = team2Stats.reduce((sum, stats) => sum + stats.cups, 0);

  const handleSave = () => {
    if (team1Score === team2Score) {
      toast({
        title: "Invalid Score",
        description: "Games cannot end in a tie.",
        variant: "destructive"
      });
      return;
    }

    onSave({
      ...match,
      team1Score,
      team2Score,
      team1Players: match.team1Players.map((p, idx) => ({
        ...p,
        cups: team1Stats[idx].cups,
        ices: team1Stats[idx].ices,
        defense: team1Stats[idx].defense
      })),
      team2Players: match.team2Players.map((p, idx) => ({
        ...p,
        cups: team2Stats[idx].cups,
        ices: team2Stats[idx].ices,
        defense: team2Stats[idx].defense
      }))
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dashboard-card text-white w-[95vw] max-w-2xl max-h-[70vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold">Match Statistics</DialogTitle>
        </DialogHeader>

        {/* Score Display with explanation - more compact */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <h3 className="text-xs text-gray-400">Team 1</h3>
              <span className="text-xl font-bold">{team1Score}</span>
            </div>
            <span className="text-sm text-gray-400">vs</span>
            <div className="text-center">
              <h3 className="text-xs text-gray-400">Team 2</h3>
              <span className="text-xl font-bold">{team2Score}</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 text-center px-4 pb-2">
            Note: The team score is automatically calculated from the total cups scored by each player. 
            To change the score, adjust the cups for individual players below.
          </p>
        </div>

        {/* Player Stats - Reduced height */}
        <div className="grid grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            {match.team1Players.map((p, idx) => (
              <PlayerStatsForm
                key={p.player.name}
                player={p.player}
                stats={team1Stats[idx]}
                onStatsChange={(field, value) => {
                  const newStats = [...team1Stats];
                  newStats[idx] = { ...newStats[idx], [field]: Math.max(0, value) };
                  setTeam1Stats(newStats);
                }}
              />
            ))}
          </div>

          <div className="space-y-2">
            {match.team2Players.map((p, idx) => (
              <PlayerStatsForm
                key={p.player.name}
                player={p.player}
                stats={team2Stats[idx]}
                onStatsChange={(field, value) => {
                  const newStats = [...team2Stats];
                  newStats[idx] = { ...newStats[idx], [field]: Math.max(0, value) };
                  setTeam2Stats(newStats);
                }}
              />
            ))}
          </div>
        </div>

        {/* Buttons - more compact */}
        <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-gray-700">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchStatsView;