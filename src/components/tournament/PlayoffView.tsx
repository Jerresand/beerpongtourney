import React, { useState } from 'react';
import { Tournament, Team } from '@/types/tournament';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Trophy } from "lucide-react";

interface PlayoffViewProps {
  tournament: Tournament;
  onTournamentUpdate: (updatedTournament: Tournament) => void;
}

const PlayoffView = ({ tournament, onTournamentUpdate }: PlayoffViewProps) => {
  const [showWarning, setShowWarning] = useState(false);

  const handleBackToRegular = () => {
    const updatedTournament: Tournament = {
      ...tournament,
      currentPhase: "regular" as const
    };
    onTournamentUpdate(updatedTournament);
  };

  // Sort teams by wins and get qualified teams
  const getQualifiedTeams = () => {
    const sortedTeams = [...tournament.teams].sort((a, b) => {
      if ((a.stats?.wins || 0) !== (b.stats?.wins || 0)) {
        return (b.stats?.wins || 0) - (a.stats?.wins || 0);
      }
      return (a.stats?.losses || 0) - (b.stats?.losses || 0);
    });

    if (sortedTeams.length >= 8) return sortedTeams.slice(0, 8);
    if (sortedTeams.length >= 4) return sortedTeams.slice(0, 4);
    return sortedTeams.slice(0, 2);
  };

  const qualifiedTeams = getQualifiedTeams();

  return (
    <div className="space-y-6">
      <Button
        onClick={() => setShowWarning(true)}
        className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform transition-all hover:scale-105"
      >
        <Trophy className="mr-2 h-6 w-6" />
        ENTER PLAYOFFS
      </Button>

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="bg-dashboard-background text-dashboard-text">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">⚠️ Warning: Enter Playoffs</DialogTitle>
            <DialogDescription className="text-dashboard-text pt-2">
              After entering playoffs, all regular season stats and scores will be locked and cannot be edited anymore. 
              Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowWarning(false)}
              className="bg-dashboard-background text-dashboard-text hover:bg-dashboard-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setShowWarning(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Enter Playoffs
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="bg-dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-white">
            Playoff Teams ({qualifiedTeams.length} Team Bracket)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {qualifiedTeams.map((team, index) => (
              <div 
                key={team.id}
                className="flex justify-between items-center p-3 bg-dashboard-background rounded-lg"
              >
                <span className="text-white font-medium">#{index + 1} {team.name}</span>
                <span className="text-dashboard-text">
                  W: {team.stats?.wins || 0} L: {team.stats?.losses || 0}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayoffView; 