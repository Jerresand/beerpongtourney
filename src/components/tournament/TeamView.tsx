import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Match, Player } from '@/types/tournament';

interface TeamViewProps {
  matches: Match[];
  onTeamNameUpdate: (teamId: string, newName: string) => void;
}

interface Team {
  id: string;
  players: Player[];
  name: string;
}

const TeamView = ({ matches, onTeamNameUpdate }: TeamViewProps) => {
  const [teams, setTeams] = useState<Team[]>(() => {
    if (!matches || matches.length === 0) return [];
    
    const uniqueTeams = new Map<string, Team>();
    
    matches.forEach(match => {
      if (!match.team1Players || !match.team2Players) return;
      
      // Process team 1
      const team1Id = match.team1Players.map(p => p.player.name).sort().join('-');
      if (!uniqueTeams.has(team1Id)) {
        const defaultName = `Team ${match.team1Players.map(p => p.player.name.substring(0, 3)).join('')}`;
        uniqueTeams.set(team1Id, {
          id: team1Id,
          players: match.team1Players.map(p => p.player),
          name: defaultName
        });
      }
      
      // Process team 2
      const team2Id = match.team2Players.map(p => p.player.name).sort().join('-');
      if (!uniqueTeams.has(team2Id)) {
        const defaultName = `Team ${match.team2Players.map(p => p.player.name.substring(0, 3)).join('')}`;
        uniqueTeams.set(team2Id, {
          id: team2Id,
          players: match.team2Players.map(p => p.player),
          name: defaultName
        });
      }
    });
    
    return Array.from(uniqueTeams.values());
  });

  const handleNameChange = (teamId: string, newName: string) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, name: newName } : team
    ));
    onTeamNameUpdate(teamId, newName);
  };

  return (
    <div className="bg-dashboard-card p-6 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">Teams</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team Name</TableHead>
            <TableHead>Players</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="text-white">
                {team.name}
              </TableCell>
              <TableCell className="text-dashboard-text">
                {team.players.map(p => p.name).join(' & ')}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Input
                    placeholder="New team name"
                    className="max-w-[200px]"
                    onChange={(e) => handleNameChange(team.id, e.target.value)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamView;