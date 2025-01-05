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

  const playoffTeams = getCurrentRoundTeams();

  return (
    <div className="space-y-6">
      <Card className="bg-dashboard-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            Playoff Bracket - Round {tournament.playoffMatches[0]?.series || 1}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {tournament.playoffMatches.map((match, index) => {
              const team1 = tournament.teams.find(t => t.id === match.team1Id);
              const team2 = tournament.teams.find(t => t.id === match.team2Id);
              return (
                <Card key={match.id} className="bg-dashboard-background p-4">
                  <div className="text-lg font-bold text-white mb-2">
                    Match {index + 1}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white">{team1?.name}</span>
                      <span className="text-dashboard-text">Seed #{playoffTeams.findIndex(t => t.id === team1?.id) + 1}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">{team2?.name}</span>
                      <span className="text-dashboard-text">Seed #{playoffTeams.findIndex(t => t.id === team2?.id) + 1}</span>
                    </div>
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