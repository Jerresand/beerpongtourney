import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Match, Player } from '@/types/tournament';
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

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

  const validateAndSave = () => {
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

  const updateTeamStats = (
    teamStats: typeof team1Stats,
    setTeamStats: React.Dispatch<React.SetStateAction<typeof team1Stats>>,
    playerIndex: number,
    field: 'cups' | 'ices' | 'defense',
    value: number
  ) => {
    const newStats = [...teamStats];
    newStats[playerIndex] = {
      ...newStats[playerIndex],
      [field]: Math.max(0, value)
    };
    setTeamStats(newStats);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-dashboard-card text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Match Statistics</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-8 mt-4">
          {/* Team 1 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Team 1</h3>
            <div className="mb-4">
              <Label>Score</Label>
              <Input
                type="number"
                value={team1Score}
                onChange={(e) => setTeam1Score(Math.max(0, parseInt(e.target.value) || 0))}
                className="bg-dashboard-background text-white"
              />
            </div>
            {match.team1Players.map((player, idx) => (
              <div key={idx} className="mb-4 p-4 bg-dashboard-background rounded-lg">
                <h4 className="font-medium mb-2">{player.player.name}</h4>
                <div className="space-y-2">
                  <div>
                    <Label>Cups</Label>
                    <Input
                      type="number"
                      value={team1Stats[idx].cups}
                      onChange={(e) => updateTeamStats(team1Stats, setTeam1Stats, idx, 'cups', parseInt(e.target.value) || 0)}
                      className="bg-dashboard-card"
                    />
                  </div>
                  <div>
                    <Label>Ices</Label>
                    <Input
                      type="number"
                      value={team1Stats[idx].ices}
                      onChange={(e) => updateTeamStats(team1Stats, setTeam1Stats, idx, 'ices', parseInt(e.target.value) || 0)}
                      className="bg-dashboard-card"
                    />
                  </div>
                  <div>
                    <Label>Defenses</Label>
                    <Input
                      type="number"
                      value={team1Stats[idx].defense}
                      onChange={(e) => updateTeamStats(team1Stats, setTeam1Stats, idx, 'defense', parseInt(e.target.value) || 0)}
                      className="bg-dashboard-card"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Team 2 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Team 2</h3>
            <div className="mb-4">
              <Label>Score</Label>
              <Input
                type="number"
                value={team2Score}
                onChange={(e) => setTeam2Score(Math.max(0, parseInt(e.target.value) || 0))}
                className="bg-dashboard-background text-white"
              />
            </div>
            {match.team2Players.map((player, idx) => (
              <div key={idx} className="mb-4 p-4 bg-dashboard-background rounded-lg">
                <h4 className="font-medium mb-2">{player.player.name}</h4>
                <div className="space-y-2">
                  <div>
                    <Label>Cups</Label>
                    <Input
                      type="number"
                      value={team2Stats[idx].cups}
                      onChange={(e) => updateTeamStats(team2Stats, setTeam2Stats, idx, 'cups', parseInt(e.target.value) || 0)}
                      className="bg-dashboard-card"
                    />
                  </div>
                  <div>
                    <Label>Ices</Label>
                    <Input
                      type="number"
                      value={team2Stats[idx].ices}
                      onChange={(e) => updateTeamStats(team2Stats, setTeam2Stats, idx, 'ices', parseInt(e.target.value) || 0)}
                      className="bg-dashboard-card"
                    />
                  </div>
                  <div>
                    <Label>Defenses</Label>
                    <Input
                      type="number"
                      value={team2Stats[idx].defense}
                      onChange={(e) => updateTeamStats(team2Stats, setTeam2Stats, idx, 'defense', parseInt(e.target.value) || 0)}
                      className="bg-dashboard-card"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
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