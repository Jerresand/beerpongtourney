import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Match, Team, Tournament } from '@/types/tournament';

interface TeamViewProps {
  tournament: Tournament;
  onTeamNameUpdate: (teamId: string, name: string) => void;
}

const TeamView = ({ tournament, onTeamNameUpdate }: TeamViewProps) => {
  const handleNameChange = (teamId: string, newName: string) => {
    // Get the current tournament data
    const tournaments = JSON.parse(localStorage.getItem('activeTournaments') || '[]');
    const tournamentIndex = tournaments.findIndex((t: Tournament) => t.id === tournament.id);
    
    if (tournamentIndex === -1) {
      console.error('Tournament not found');
      return;
    }

    // Update the team name in the tournament
    const updatedTournament = {
      ...tournaments[tournamentIndex],
      teams: tournaments[tournamentIndex].teams.map((t: Team) =>
        t.id === teamId ? { ...t, name: newName } : t
      )
    };

    // Save the updated tournament
    tournaments[tournamentIndex] = updatedTournament;
    localStorage.setItem('activeTournaments', JSON.stringify(tournaments));

    // Notify parent component
    onTeamNameUpdate(teamId, newName);

    // Force a re-render by updating the URL
    window.dispatchEvent(new Event('storage'));
  };

  if (!tournament.teams || tournament.teams.length === 0) {
    return (
      <div className="bg-dashboard-card p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">Teams</h3>
        <p className="text-dashboard-text">No teams created yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-dashboard-card p-6 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">Teams</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead key="name">Team Name</TableHead>
            <TableHead key="players">Players</TableHead>
            <TableHead key="stats">Stats</TableHead>
            <TableHead key="actions">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tournament.teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell key={`${team.id}-name`} className="text-white">
                {team.name}
              </TableCell>
              <TableCell key={`${team.id}-players`} className="text-dashboard-text">
                {team.players.map(p => p.name).join(' & ')}
              </TableCell>
              <TableCell key={`${team.id}-stats`} className="text-dashboard-text">
                <div className="text-sm">
                  W: {team.stats?.wins || 0} L: {team.stats?.losses || 0} ({team.stats?.gamesPlayed || 0} games)
                </div>
              </TableCell>
              <TableCell key={`${team.id}-actions`}>
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