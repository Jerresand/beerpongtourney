import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Match } from '@/types/tournament';
import { toast } from "@/components/ui/use-toast";
import TeamStatsForm from './TeamStatsForm';

interface MatchViewProps {
  match: Match;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMatch: Match) => void;
}

const MatchView = ({ match, isOpen, onClose, onSave }: MatchViewProps) => {
  const [team1Score, setTeam1Score] = useState(match.team1Score || 0);
  const [team2Score, setTeam2Score] = useState(match.team2Score || 0);
  const [team1Stats, setTeam1Stats] = useState(
    match.team1Players.map(p => ({
      cups: p.cups || 0,
      ices: p.isIcer ? 1 : 0,
      defense: p.defense || 0
    }))
  );
  const [team2Stats, setTeam2Stats] = useState(
    match.team2Players.map(p => ({
      cups: p.cups || 0,
      ices: p.isIcer ? 1 : 0,
      defense: p.defense || 0
    }))
  );

  const isSingles = match.team1Players.length === 1 && match.team2Players.length === 1;

  const validateAndSave = () => {
    // Prevent ties
    if (team1Score === team2Score) {
      toast({
        title: "Invalid Score",
        description: "Games cannot end in a tie. Please adjust the score.",
        variant: "destructive",
      });
      return;
    }

    // Validate total cups matches team score
    const team1TotalCups = team1Stats.reduce((sum, stat) => sum + stat.cups, 0);
    const team2TotalCups = team2Stats.reduce((sum, stat) => sum + stat.cups, 0);

    if (team1TotalCups !== team1Score) {
      toast({
        title: "Invalid cups distribution",
        description: "Team 1's total cups must equal their score",
        variant: "destructive",
      });
      return;
    }

    if (team2TotalCups !== team2Score) {
      toast({
        title: "Invalid cups distribution",
        description: "Team 2's total cups must equal their score",
        variant: "destructive",
      });
      return;
    }

    const updatedMatch: Match = {
      ...match,
      team1Score,
      team2Score,
      team1Players: match.team1Players.map((player, idx) => ({
        ...player,
        cups: team1Stats[idx].cups,
        defense: team1Stats[idx].defense,
        isIcer: team1Stats[idx].ices > 0
      })),
      team2Players: match.team2Players.map((player, idx) => ({
        ...player,
        cups: team2Stats[idx].cups,
        defense: team2Stats[idx].defense,
        isIcer: team2Stats[idx].ices > 0
      }))
    };

    onSave(updatedMatch);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-dashboard-card text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Match Statistics</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-8 mt-4">
          <TeamStatsForm
            teamName="Team 1"
            score={team1Score}
            onScoreChange={(newScore) => {
              setTeam1Score(newScore);
              if (isSingles) {
                setTeam1Stats([{ ...team1Stats[0], cups: newScore }]);
              }
            }}
            players={match.team1Players}
            playerStats={team1Stats}
            onPlayerStatsChange={(playerIndex, field, value) => {
              const newStats = [...team1Stats];
              newStats[playerIndex] = { ...newStats[playerIndex], [field]: Math.max(0, value) };
              setTeam1Stats(newStats);
            }}
          />
          <TeamStatsForm
            teamName="Team 2"
            score={team2Score}
            onScoreChange={(newScore) => {
              setTeam2Score(newScore);
              if (isSingles) {
                setTeam2Stats([{ ...team2Stats[0], cups: newScore }]);
              }
            }}
            players={match.team2Players}
            playerStats={team2Stats}
            onPlayerStatsChange={(playerIndex, field, value) => {
              const newStats = [...team2Stats];
              newStats[playerIndex] = { ...newStats[playerIndex], [field]: Math.max(0, value) };
              setTeam2Stats(newStats);
            }}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={validateAndSave}>Save Match Statistics</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchView;