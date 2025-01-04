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
  const [teamStats, setTeamStats] = useState(match.teams.map(team => ({
    score: team.score,
    playerStats: team.playerStats.map(stat => ({
      player: stat.player,
      cups: stat.cups || 0,
      ices: stat.ices || 0,
      defense: stat.defense || 0
    }))
  })));

  const handleSave = () => {
    if (teamStats[0].score === teamStats[1].score) {
      toast({
        title: "Invalid Score",
        description: "Games cannot end in a tie.",
        variant: "destructive"
      });
      return;
    }

    onSave({
      ...match,
      teams: [
        { ...match.teams[0], score: teamStats[0].score, playerStats: teamStats[0].playerStats },
        { ...match.teams[1], score: teamStats[1].score, playerStats: teamStats[1].playerStats }
      ]
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
              <span className="text-xl font-bold">{teamStats[0].score}</span>
            </div>
            <span className="text-sm text-gray-400">vs</span>
            <div className="text-center">
              <h3 className="text-xs text-gray-400">Team 2</h3>
              <span className="text-xl font-bold">{teamStats[1].score}</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 text-center px-4 pb-2">
            Note: The team score is automatically calculated from the total cups scored by each player. 
            To change the score, adjust the cups for individual players below.
          </p>
        </div>

        {/* Player Stats - Reduced height */}
        <div className="grid grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2">
          {match.teams.map((team, teamIndex) => (
            <div key={team.team.id} className="space-y-2">
              {team.playerStats.map((playerStat, playerIndex) => (
                <PlayerStatsForm
                  key={playerStat.player.id}
                  player={playerStat.player}
                  stats={teamStats[teamIndex].playerStats[playerIndex]}
                  onStatsChange={(field, value) => {
                    setTeamStats(prev => {
                      const newStats = [...prev];
                      newStats[teamIndex] = {
                        ...newStats[teamIndex],
                        playerStats: newStats[teamIndex].playerStats.map((stat, idx) =>
                          idx === playerIndex ? { ...stat, [field]: Math.max(0, value) } : stat
                        ),
                        // Update score when cups change
                        score: field === 'cups' 
                          ? newStats[teamIndex].playerStats.reduce((sum, s, i) => 
                              sum + (i === playerIndex ? value : s.cups), 0)
                          : newStats[teamIndex].score
                      };
                      return newStats;
                    });
                  }}
                />
              ))}
            </div>
          ))}
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