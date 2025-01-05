import React, { useState } from 'react';
import { Tournament, Team, PlayoffMatch } from '@/types/tournament';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Trophy } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EnterPlayoffViewProps {
  tournament: Tournament;
  onTournamentUpdate: (updatedTournament: Tournament) => void;
}

const EnterPlayoffView = ({ tournament, onTournamentUpdate }: EnterPlayoffViewProps) => {
  const [showWarning, setShowWarning] = useState(false);
  const [selectedPlayoffSize, setSelectedPlayoffSize] = useState<string>("all");

  // Get available playoff sizes based on team count
  const getAvailablePlayoffSizes = () => {
    const teamCount = tournament.teams.length;
    const sizes: string[] = [];
    
    if (teamCount >= 16) sizes.push("16");
    if (teamCount >= 8) sizes.push("8");
    if (teamCount >= 4) sizes.push("4");
    if (teamCount >= 2) sizes.push("2");
    
    // Add the actual team count if it's not already in the list and is a power of 2
    const isPowerOfTwo = (n: number) => Math.log2(n) % 1 === 0;
    if (isPowerOfTwo(teamCount) && !sizes.includes(teamCount.toString())) {
      sizes.push(teamCount.toString());
    }
    
    return sizes;
  };

  // Get descriptive text for playoff format
  const getPlayoffFormatDescription = (size: string) => {
    const numTeams = parseInt(size);
    const rounds = Math.log2(numTeams);
    let description = `Top ${numTeams} teams qualify based on regular season record. `;
    
    if (rounds === 4) {
      description += "Four rounds: Round of 16 → Quarter-Finals → Semi-Finals → Finals";
    } else if (rounds === 3) {
      description += "Three rounds: Quarter-Finals → Semi-Finals → Finals";
    } else if (rounds === 2) {
      description += "Two rounds: Semi-Finals → Finals";
    } else {
      description += "Single round: Finals";
    }
    
    return description;
  };

  // Sort teams by wins and get qualified teams
  const getQualifiedTeams = () => {
    const sortedTeams = [...tournament.teams].sort((a, b) => {
      if ((a.stats?.wins || 0) !== (b.stats?.wins || 0)) {
        return (b.stats?.wins || 0) - (a.stats?.wins || 0);
      }
      return (a.stats?.losses || 0) - (b.stats?.losses || 0);
    });

    return sortedTeams.slice(0, parseInt(selectedPlayoffSize));
  };

  // Create playoff matchups with proper seeding
  const createPlayoffMatchups = (teams: Team[]): PlayoffMatch[] => {
    const matches: PlayoffMatch[] = [];
    const numTeams = teams.length;
    
    // Create matchups where highest seed plays lowest seed
    for (let i = 0; i < numTeams / 2; i++) {
      matches.push({
        id: crypto.randomUUID(),
        team1Id: teams[i].id, // Higher seed
        team2Id: teams[numTeams - 1 - i].id, // Lower seed
        team1Score: 0,
        team2Score: 0,
        team1PlayerStats: [],
        team2PlayerStats: [],
        isComplete: false,
        isPlayoff: true,
        series: 1
      });
    }
    
    return matches;
  };

  const handleStartPlayoffs = () => {
    const qualifiedTeams = getQualifiedTeams();
    const initialPlayoffMatches = createPlayoffMatchups(qualifiedTeams);

    // Create a map of team IDs to their seeds
    const seedMap = Object.fromEntries(
      qualifiedTeams.map((team, index) => [team.id, index + 1])
    );

    const updatedTournament: Tournament = {
      ...tournament,
      currentPhase: "playoffs" as const,
      playoffMatches: initialPlayoffMatches,
      playoffSeedMap: seedMap
    };

    onTournamentUpdate(updatedTournament);
    setShowWarning(false);
  };

  const qualifiedTeams = getQualifiedTeams();
  const availablePlayoffSizes = getAvailablePlayoffSizes();

  return (
    <div className="space-y-6">
      <Card className="bg-dashboard-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            Choose Playoff Format
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Select
              value={selectedPlayoffSize}
              onValueChange={setSelectedPlayoffSize}
            >
              <SelectTrigger className="w-full bg-dashboard-background text-dashboard-text">
                <SelectValue placeholder="Select playoff size" />
              </SelectTrigger>
              <SelectContent className="bg-dashboard-background text-dashboard-text">
                {availablePlayoffSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {`Top ${size} Teams`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedPlayoffSize && (
              <div className="text-sm text-dashboard-text mt-2 p-3 bg-dashboard-background rounded-lg">
                {getPlayoffFormatDescription(selectedPlayoffSize)}
              </div>
            )}
          </div>

          <Button
            onClick={() => setShowWarning(true)}
            className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform transition-all hover:scale-105"
          >
            <Trophy className="mr-2 h-6 w-6" />
            ENTER PLAYOFFS
          </Button>
        </CardContent>
      </Card>

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
              onClick={handleStartPlayoffs}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Start Playoffs
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

export default EnterPlayoffView; 