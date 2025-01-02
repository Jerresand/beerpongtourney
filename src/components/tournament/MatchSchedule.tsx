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
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import MatchView from './MatchView';
import { useToast } from "@/components/ui/use-toast";

interface MatchScheduleProps {
  matches: Match[];
  onMatchUpdate?: (updatedMatch: Match) => void;
}

const MatchSchedule = ({ matches, onMatchUpdate }: MatchScheduleProps) => {
  const { toast } = useToast();
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Get all available rounds/series
  const rounds = [...new Set(matches.map(m => 
    'round' in m ? m.round : m.series
  ))].sort((a, b) => (a || 0) - (b || 0));

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

  const handleMatchUpdate = (updatedMatch: Match) => {
    if (onMatchUpdate) {
      onMatchUpdate(updatedMatch);
      toast({
        title: "Match Updated",
        description: "The match statistics have been saved successfully.",
      });
    }
  };

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
            <TableHead className="text-right">Actions</TableHead>
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
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedMatch(match)}
                  className="hover:bg-dashboard-background"
                >
                  <CalendarDays className="h-5 w-5 text-dashboard-text" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedMatch && (
        <MatchView
          match={selectedMatch}
          isOpen={true}
          onClose={() => setSelectedMatch(null)}
          onSave={handleMatchUpdate}
        />
      )}
    </div>
  );
};

export default MatchSchedule;