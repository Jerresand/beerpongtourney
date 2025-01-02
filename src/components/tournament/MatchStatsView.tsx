import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Match } from '@/types/tournament';
import { useToast } from "@/components/ui/use-toast";
import TeamStatsCard from './TeamStatsCard';

interface MatchStatsProps {
  match: Match;
  isOpen: boolean;
  onClose: () => void;
  onSave: (match: Match) => void;
}

const MatchStatsView = ({ match, isOpen, onClose, onSave }: MatchStatsProps) => {
  const { toast } = useToast();
  const [team1Score, setTeam1Score] = useState(match.team1Score || 0);
  const [team2Score, setTeam2Score] = useState(match.team2Score || 0);
  const [team1Stats, setTeam1Stats] = useState(
    match.team1Players.map(p => ({
      cups: p.cups || 0,
      ices: p.ices || 0,
      defense: p.defense || 0
    }))
  );
  const [team2Stats, setTeam2Stats] = useState(
    match.team2Players.map(p => ({
      cups: p.cups || 0,
      ices: p.ices || 0,
      defense: p.defense || 0
    }))
  );

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
        player: p.player,
        cups: team1Stats[idx].cups,
        ices: team1Stats[idx].ices,
        defense: team1Stats[idx].defense
      })),
      team2Players: match.team2Players.map((p, idx) => ({
        player: p.player,
        cups: team2Stats[idx].cups,
        ices: team2Stats[idx].ices,
        defense: team2Stats[idx].defense
      }))
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dashboard-card text-white max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Match Statistics</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <TeamStatsCard
            teamName="Team 1"
            score={team1Score}
            onScoreChange={setTeam1Score}
            players={match.team1Players.map((p, idx) => ({
              name: p.player.name,
              stats: team1Stats[idx],
              onStatsChange: (field, value) => {
                const newStats = [...team1Stats];
                newStats[idx] = { ...newStats[idx], [field]: value };
                setTeam1Stats(newStats);
              }
            }))}
          />
          <TeamStatsCard
            teamName="Team 2"
            score={team2Score}
            onScoreChange={setTeam2Score}
            players={match.team2Players.map((p, idx) => ({
              name: p.player.name,
              stats: team2Stats[idx],
              onStatsChange: (field, value) => {
                const newStats = [...team2Stats];
                newStats[idx] = { ...newStats[idx], [field]: value };
                setTeam2Stats(newStats);
              }
            }))}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            Save Match
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchStatsView;