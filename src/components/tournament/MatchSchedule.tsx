import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Match, Player, Team, Tournament } from '@/types/tournament';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import MatchStatisticsManager from './MatchStatisticsManager';
import { useToast } from "@/components/ui/use-toast";
import { isRegularMatch } from '@/types/tournament';

interface MatchScheduleProps {
  matches: Match[];
  tournament: Tournament;
  onMatchUpdate?: (match: Match, updatedTeams: Team[], updatedPlayers: Player[]) => void;
}

const MatchSchedule: React.FC<MatchScheduleProps> = ({ matches, tournament, onMatchUpdate }) => {
  const { toast } = useToast();
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [teamMap, setTeamMap] = useState<Map<string, Team>>(new Map());

  // Initialize team map for faster lookups
  useEffect(() => {
    const map = new Map<string, Team>();
    tournament.teams.forEach(team => {
      map.set(team.id, team);
      console.log(`Mapping team ID ${team.id} to team name "${team.name}"`);
    });
    setTeamMap(map);

    // Debug: Log all matches and their team IDs
    matches.forEach(match => {
      console.log(`Match ${match.id}:`, {
        team1Id: match.team1Id,
        team2Id: match.team2Id,
        team1Name: map.get(match.team1Id)?.name || 'Unknown',
        team2Name: map.get(match.team2Id)?.name || 'Unknown'
      });
    });
  }, [tournament.teams, matches]);

  // Get unique rounds from matches
  const rounds = Array.from(new Set(matches.map(m => 
    isRegularMatch(m) ? m.round : m.series
  ))).sort((a, b) => (a || 0) - (b || 0));

  // Get team name by ID with error handling
  const getTeamName = (teamId: string): string => {
    const team = teamMap.get(teamId);
    if (!team) {
      console.warn(`Team with ID ${teamId} not found in team map. Available teams:`, 
        Array.from(teamMap.entries()).map(([id, team]) => ({ id, name: team.name }))
      );
      return 'Unknown Team';
    }
    return team.name;
  };

  // Filter matches for current round
  const currentRoundMatches = matches.filter(match => 
    isRegularMatch(match) ? match.round === selectedRound : match.series === selectedRound
  );

  // Handle match update
  const handleMatchUpdate = (updatedMatch: Match, updatedTeams: Team[], updatedPlayers: Player[]) => {
    if (onMatchUpdate) {
      // Update team map with new team data
      const newTeamMap = new Map(teamMap);
      updatedTeams.forEach(team => {
        newTeamMap.set(team.id, team);
      });
      setTeamMap(newTeamMap);

      onMatchUpdate(updatedMatch, updatedTeams, updatedPlayers);
      toast({
        title: "Match Updated",
        description: "The match statistics have been saved successfully.",
      });
      setSelectedMatch(null);
    }
  };

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
          {currentRoundMatches.map((match, index) => {
            const team1Name = getTeamName(match.team1Id);
            const team2Name = getTeamName(match.team2Id);
            
            return (
              <TableRow key={match.id} className="hover:bg-muted/5">
                <TableCell className="text-dashboard-text font-medium">
                  #{index + 1}
                </TableCell>
                <TableCell className="text-white">
                  {team1Name}
                </TableCell>
                <TableCell className="text-center text-white">
                  {match.team1Score !== undefined ? match.team1Score : '-'} - {match.team2Score !== undefined ? match.team2Score : '-'}
                </TableCell>
                <TableCell className="text-white">
                  {team2Name}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedMatch(match)}
                    className="hover:bg-dashboard-background"
                  >
                    <Pencil className="h-5 w-5 text-dashboard-text" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {selectedMatch && (
        <MatchStatisticsManager
          match={selectedMatch}
          tournament={tournament}
          isOpen={true}
          onClose={() => setSelectedMatch(null)}
          onSave={handleMatchUpdate}
        />
      )}
    </div>
  );
};

export default MatchSchedule;