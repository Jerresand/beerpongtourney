import React, { useState } from 'react';
import { useTournament } from '@/contexts/TournamentContext';
import { Match } from '@/types/tournament';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MatchScheduleProps {
  matches?: Match[];
  onMatchUpdate?: (match: Match) => void;
}

const MatchSchedule: React.FC<MatchScheduleProps> = ({ matches: propMatches, onMatchUpdate }) => {
  const { tournament } = useTournament();
  const matches = propMatches || tournament?.regularMatches || [];
  
  if (!matches.length) {
    return null;
  }

  const [selectedRound, setSelectedRound] = useState<number>(1);

  const rounds = [...new Set(matches.map(m => 'round' in m ? m.round : 1))].sort((a, b) => a - b);
  const roundMatches = matches.filter(match => 'round' in match ? match.round === selectedRound : true);

  return (
    <div className="bg-dashboard-card p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Match Schedule</h3>
        <Select
          value={selectedRound.toString()}
          onValueChange={(value) => setSelectedRound(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Round" />
          </SelectTrigger>
          <SelectContent>
            {rounds.map((round) => (
              <SelectItem key={round} value={round.toString()}>
                Round {round}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {roundMatches.map((match, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-dashboard-background rounded-lg">
            <div className="flex-1 grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
              <div className="text-right text-white">{match.teams[0].team.name}</div>
              <div className="text-center text-gray-400">
                {`${match.teams[0].score} - ${match.teams[1].score}`}
              </div>
              <div className="text-left text-white">{match.teams[1].team.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchSchedule;