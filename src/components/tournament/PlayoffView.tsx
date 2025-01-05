import React from 'react';
import { Tournament, Match, Team, Player } from '@/types/tournament';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PlayoffViewProps {
  tournament: Tournament;
  onTournamentUpdate: (tournament: Tournament) => void;
}

const PlayoffView: React.FC<PlayoffViewProps> = ({ tournament, onTournamentUpdate }) => {
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

  const playoffTeams = getCurrentRoundTeams();
  const { roundName } = getRoundInfo();

  return (
    <div className="space-y-6">
      <Card className="bg-dashboard-card">
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
              const team1Seed = playoffTeams.findIndex(t => t.id === team1?.id) + 1;
              const team2Seed = playoffTeams.findIndex(t => t.id === team2?.id) + 1;

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
    </div>
  );
};

export default PlayoffView; 