import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Match, Player } from '@/types/tournament';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MatchScheduleProps {
  matches: Match[];
}

const MatchSchedule = ({ matches }: MatchScheduleProps) => {
  // Get all available rounds/series
  const rounds = [...new Set(matches.map(m => 
    'round' in m ? m.round : m.series
  ))].sort((a, b) => (a || 0) - (b || 0));
  const [selectedRound, setSelectedRound] = useState<number>(rounds[0] || 1);

  const formatTeamName = (players: { player: Player }[]) => {
    if (!players || !Array.isArray(players)) return '-';
    return players
      .filter(p => p && p.player && p.player.name)
      .map(p => p.player.name)
      .join(' & ') || '-';
  };

  // Filter matches by selected round/series
  const roundMatches = matches.filter(match => 
    'round' in match ? match.round === selectedRound : match.series === selectedRound
  );

  // If there are no matches, show a message
  if (!matches || matches.length === 0) {
    return (
      <div className="bg-dashboard-card p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">Tournament Schedule</h3>
        <p className="text-dashboard-text">No matches scheduled yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-dashboard-card p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Tournament Schedule</h3>
        <Select
          value={selectedRound.toString()}
          onValueChange={(value) => setSelectedRound(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Round" />
          </SelectTrigger>
          <SelectContent>
            {rounds.map((round) => (
              <SelectItem key={round} value={round?.toString() || "1"}>
                Round {round}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-dashboard-text">Match</TableHead>
            <TableHead>Team 1</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead>Team 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roundMatches.map((match, index) => (
            <TableRow key={match.id} className="hover:bg-muted/5">
              <TableCell className="text-dashboard-text font-medium">
                #{index + 1}
              </TableCell>
              <TableCell className="text-white">
                {formatTeamName(match.team1Players)}
              </TableCell>
              <TableCell className="text-center text-white">
                {match.team1Score !== undefined ? match.team1Score : '-'} - {match.team2Score !== undefined ? match.team2Score : '-'}
              </TableCell>
              <TableCell className="text-white">
                {formatTeamName(match.team2Players)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatchSchedule;