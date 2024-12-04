import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Match, Player } from '@/types/tournament';

interface MatchScheduleProps {
  matches: Match[];
}

const MatchSchedule = ({ matches }: MatchScheduleProps) => {
  const formatTeamName = (players: { player: Player }[]) => {
    return players.map(p => p.player.name).join(' & ');
  };

  return (
    <div className="bg-dashboard-card p-6 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">Match Schedule</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team 1</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead>Team 2</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches?.map((match) => (
            <TableRow key={match.id}>
              <TableCell className="text-white">
                {formatTeamName(match.team1Players)}
              </TableCell>
              <TableCell className="text-center text-white">
                {match.team1Score || 0} - {match.team2Score || 0}
              </TableCell>
              <TableCell className="text-white">
                {formatTeamName(match.team2Players)}
              </TableCell>
              <TableCell className="text-dashboard-text">
                {new Date(match.date).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatchSchedule;