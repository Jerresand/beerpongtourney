import React from 'react';
import { useTournament } from '@/contexts/TournamentContext';
import { Input } from "@/components/ui/input";
import { Team } from '@/types/tournament';

const TeamView = () => {
  const { tournament, updateTournament } = useTournament();
  console.log("TeamView - tournament:", tournament);
  console.log("TeamView - teams:", tournament?.teams);

  // Create teams array from matches if it doesn't exist
  const teams = tournament?.teams || tournament?.regularMatches.reduce((acc, match) => {
    match.teams.forEach(team => {
      if (!acc.find(t => t.id === team.team.id)) {
        acc.push(team.team);
      }
    });
    return acc;
  }, [] as Team[]) || [];
  console.log("TeamView - computed teams:", teams);

  if (!tournament) return null;

  const handleNameChange = (teamId: string, newName: string) => {
    const updatedTeams = tournament.teams?.map(team => 
      team.id === teamId ? { ...team, name: newName } : team
    );

    updateTournament({
      ...tournament,
      teams: updatedTeams
    });
  };

  return (
    <div className="bg-dashboard-card p-6 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">Teams</h3>
      <div className="space-y-3">
        {tournament.teams.map((team) => (
          <div key={team.id} className="flex items-center gap-4 p-3 bg-dashboard-background rounded-lg">
            <div className="flex-1">
              <p className="text-sm text-gray-400">Players</p>
              <p className="text-white">{team.players.map(p => p.name).join(' & ')}</p>
            </div>
            <div className="w-64">
              <p className="text-sm text-gray-400 mb-1">Team Name</p>
              <Input
                value={team.name}
                onChange={(e) => handleNameChange(team.id, e.target.value)}
                className="bg-dashboard-card"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamView;