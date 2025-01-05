import React, { useState } from 'react';
import { Tournament, Match, Team, Player } from '@/types/tournament';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RotateCcw } from "lucide-react";

interface PlayoffViewProps {
  tournament: Tournament;
  onTournamentUpdate: (tournament: Tournament) => void;
}

const PlayoffView: React.FC<PlayoffViewProps> = ({ tournament, onTournamentUpdate }) => {
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  // Get teams in current round
  const getCurrentRoundTeams = () => {
    const teams = new Set<string>();
    tournament.playoffMatches.forEach(match => {
      teams.add(match.team1Id);
      teams.add(match.team2Id);
    });
    return Array.from(teams).map(teamId => 
      tournament.teams.find(team => team.id === teamId)
    ).filter((team): team is Team => team !== undefined);
  };

  // Get the current round number and total rounds
  const getRoundInfo = () => {
    const totalTeams = getCurrentRoundTeams().length;
    const totalRounds = Math.ceil(Math.log2(totalTeams));
    const currentRound = tournament.playoffMatches[0]?.series || 1;
    const roundName = getRoundName(currentRound, totalRounds);
    return { currentRound, totalRounds, roundName };
  };

  // Get round name based on current round and total rounds
  const getRoundName = (currentRound: number, totalRounds: number) => {
    if (currentRound === totalRounds) return "Finals";
    if (currentRound === totalRounds - 1) return "Semi-Finals";
    if (currentRound === totalRounds - 2) return "Quarter-Finals";
    return `Round ${currentRound}`;
  };

  const handleResetPlayoffs = () => {
    const updatedTournament: Tournament = {
      ...tournament,
      currentPhase: "regular" as const,
      playoffMatches: [],
      playoffSeedMap: undefined // Clear the seed map when resetting
    };
    onTournamentUpdate(updatedTournament);
    setShowResetConfirmation(false);
  };

  const playoffTeams = getCurrentRoundTeams();
  const { roundName } = getRoundInfo();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Card className="bg-dashboard-card flex-1">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">
              Playoff Bracket - {roundName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tournament.playoffMatches.map((match, index) => {
                const team1 = tournament.teams.find(t => t.id === match.team1Id);
                const team2 = tournament.teams.find(t => t.id === match.team2Id);
                const team1Seed = tournament.playoffSeedMap?.[match.team1Id] || 0;
                const team2Seed = tournament.playoffSeedMap?.[match.team2Id] || 0;

                return (
                  <Card key={match.id} className="bg-dashboard-background p-4">
                    <div className="text-lg font-bold text-white mb-2">
                      Match {index + 1}
                    </div>
                    <div className="space-y-4">
                      <div className={`flex justify-between items-center p-2 rounded ${match.isComplete && match.team1Score > match.team2Score ? 'bg-green-900/20' : ''}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-white">{team1?.name}</span>
                          <span className="text-xs text-dashboard-text">#{team1Seed}</span>
                        </div>
                        <span className="text-white font-bold">{match.team1Score}</span>
                      </div>
                      <div className={`flex justify-between items-center p-2 rounded ${match.isComplete && match.team2Score > match.team1Score ? 'bg-green-900/20' : ''}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-white">{team2?.name}</span>
                          <span className="text-xs text-dashboard-text">#{team2Seed}</span>
                        </div>
                        <span className="text-white font-bold">{match.team2Score}</span>
                      </div>
                      {match.isComplete && (
                        <div className="text-sm text-dashboard-text text-right">
                          Match Complete
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowResetConfirmation(true)}
          className="ml-4 h-12 bg-dashboard-background text-dashboard-text hover:bg-red-900/20 hover:text-red-400"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Playoffs
        </Button>
      </div>

      <Dialog open={showResetConfirmation} onOpenChange={setShowResetConfirmation}>
        <DialogContent className="bg-dashboard-background text-dashboard-text">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">⚠️ Reset Playoffs</DialogTitle>
            <DialogDescription className="text-dashboard-text pt-2">
              This will reset the playoff bracket and allow you to reinitialize the playoffs with different settings. All playoff matches and scores will be lost.
              Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowResetConfirmation(false)}
              className="bg-dashboard-background text-dashboard-text hover:bg-dashboard-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetPlayoffs}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reset Playoffs
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayoffView; 